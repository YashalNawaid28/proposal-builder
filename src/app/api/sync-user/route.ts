import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Sync-user - Processing email:', email.toLowerCase());

    const supabase = await createClient();

    // First, check if user exists in our custom table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !existingUser) {
      console.log('Sync-user - User not found in database:', userError);
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    console.log('Sync-user - User found in database with ID:', existingUser.id);

    // Create service role client for admin operations
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if user already exists in auth system
    const { data: authUsers, error: authError } = await serviceClient.auth.admin.listUsers();
    
    if (authError) {
      console.error('Sync-user - Error listing auth users:', authError);
      return NextResponse.json({ error: 'Failed to check auth users' }, { status: 500 });
    }

    const existingAuthUser = authUsers.users.find(user => user.email === email.toLowerCase());
    
    if (existingAuthUser) {
      console.log('Sync-user - User already exists in auth system with ID:', existingAuthUser.id);
      
      // Always update the auth user metadata to ensure consistency
      try {
        const { data: updateData, error: updateError } = await serviceClient.auth.admin.updateUserById(
          existingAuthUser.id,
          {
            user_metadata: {
              user_id: existingUser.id, // Store our custom table ID in metadata
              display_name: existingUser.display_name,
              job_title: existingUser.job_title,
              role: existingUser.role,
              avatar_url: existingUser.avatar_url,
              status: existingUser.status,
              email: existingUser.email,
            }
          }
        );
        
        if (updateError) {
          console.error('Sync-user - Error updating auth user metadata:', updateError);
          return NextResponse.json({ 
            error: 'Failed to update auth user metadata',
            details: updateError.message 
          }, { status: 500 });
        }
        
        console.log('Sync-user - Successfully updated auth user metadata');
        return NextResponse.json({ 
          message: 'User synced successfully (metadata updated)',
          userId: existingUser.id, // Return our custom table ID as the primary ID
          authUserId: existingAuthUser.id,
          note: 'Auth user exists but using custom table ID as primary'
        });
      } catch (updateError) {
        console.error('Sync-user - Error updating auth user:', updateError);
        return NextResponse.json({ 
          error: 'Failed to update auth user',
          details: updateError instanceof Error ? updateError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    console.log('Sync-user - Creating new user in auth system');

    // Create user in auth system (Supabase will generate its own ID)
    const { data: authData, error: createError } = await serviceClient.auth.admin.createUser({
      email: email.toLowerCase(),
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        user_id: existingUser.id, // Store our custom table ID in metadata
        display_name: existingUser.display_name,
        job_title: existingUser.job_title,
        role: existingUser.role,
        avatar_url: existingUser.avatar_url,
        status: existingUser.status,
        email: existingUser.email,
      }
    });

    if (createError) {
      console.error('Sync-user - Error creating auth user:', createError);
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 });
    }

    console.log('Sync-user - User created successfully in auth system');
    console.log('  Custom table ID:', existingUser.id);
    console.log('  Auth system ID:', authData.user.id);

    return NextResponse.json({ 
      message: 'User synced successfully',
      userId: existingUser.id, // Return our custom table ID as the primary ID
      authUserId: authData.user.id,
      note: 'New auth user created with custom table ID stored in metadata'
    });

  } catch (error) {
    console.error('Sync-user - Error in sync-user route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
