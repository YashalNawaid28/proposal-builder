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

    console.log('Fix-user-ids - Processing email:', email.toLowerCase());

    const supabase = await createClient();

    // Get user from custom table
    const { data: customUser, error: customError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (customError || !customUser) {
      console.log('Fix-user-ids - User not found in custom table:', customError);
      return NextResponse.json({ error: 'User not found in custom table' }, { status: 404 });
    }

    console.log('Fix-user-ids - Custom table user ID:', customUser.id);

    // Create service role client
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all auth users
    const { data: authUsers, error: authError } = await serviceClient.auth.admin.listUsers();
    
    if (authError) {
      console.error('Fix-user-ids - Error listing auth users:', authError);
      return NextResponse.json({ error: 'Failed to list auth users' }, { status: 500 });
    }

    const authUser = authUsers.users.find(user => user.email === email.toLowerCase());
    
    if (!authUser) {
      console.log('Fix-user-ids - User not found in auth system');
      return NextResponse.json({ 
        message: 'User not found in auth system - run sync-user first',
        customUserId: customUser.id 
      });
    }

    console.log('Fix-user-ids - Auth user ID:', authUser.id);
    console.log('Fix-user-ids - ID mismatch detected:', customUser.id !== authUser.id);

    // Update auth user metadata to include custom table ID
    const { data: updateData, error: updateError } = await serviceClient.auth.admin.updateUserById(
      authUser.id,
      {
        user_metadata: {
          user_id: customUser.id, // Store custom table ID in metadata
          display_name: customUser.display_name,
          job_title: customUser.job_title,
          role: customUser.role,
          avatar_url: customUser.avatar_url,
          status: customUser.status,
          email: customUser.email,
        }
      }
    );

    if (updateError) {
      console.error('Fix-user-ids - Error updating auth user:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update auth user',
        details: updateError.message 
      }, { status: 500 });
    }

    console.log('Fix-user-ids - Successfully updated auth user metadata');

    return NextResponse.json({ 
      message: 'User IDs fixed successfully',
      customUserId: customUser.id,
      authUserId: authUser.id,
      note: 'Custom table ID stored in auth user metadata'
    });

  } catch (error) {
    console.error('Fix-user-ids - Error in fix-user-ids route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Fix-user-ids - Getting all users with ID mismatches');

    const supabase = await createClient();

    // Get all users from custom table
    const { data: customUsers, error: customError } = await supabase
      .from('users')
      .select('*');

    if (customError) {
      console.error('Fix-user-ids - Error fetching custom users:', customError);
      return NextResponse.json({ error: 'Failed to fetch custom users' }, { status: 500 });
    }

    // Create service role client
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all auth users
    const { data: authUsers, error: authError } = await serviceClient.auth.admin.listUsers();
    
    if (authError) {
      console.error('Fix-user-ids - Error listing auth users:', authError);
      return NextResponse.json({ error: 'Failed to list auth users' }, { status: 500 });
    }

    const mismatchedUsers = [];

    for (const customUser of customUsers) {
      const authUser = authUsers.users.find(user => user.email === customUser.email);
      
      if (authUser) {
        const hasMismatch = authUser.id !== customUser.id;
        const hasMetadata = authUser.user_metadata?.user_id === customUser.id;
        
        mismatchedUsers.push({
          email: customUser.email,
          customUserId: customUser.id,
          authUserId: authUser.id,
          hasMismatch,
          hasMetadata,
          display_name: customUser.display_name,
          status: customUser.status
        });
      } else {
        mismatchedUsers.push({
          email: customUser.email,
          customUserId: customUser.id,
          authUserId: null,
          hasMismatch: true,
          hasMetadata: false,
          display_name: customUser.display_name,
          status: customUser.status,
          note: 'No auth user found'
        });
      }
    }

    return NextResponse.json({ 
      users: mismatchedUsers,
      total: mismatchedUsers.length,
      withMismatches: mismatchedUsers.filter(u => u.hasMismatch).length,
      withoutAuth: mismatchedUsers.filter(u => !u.authUserId).length
    });

  } catch (error) {
    console.error('Fix-user-ids - Error in GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 