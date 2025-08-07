import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Sync-user - Processing email:', email.toLowerCase());

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

    console.log('Sync-user - User found in database:', existingUser.id);

    // Check if user already exists in auth system
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Sync-user - Error listing auth users:', authError);
      return NextResponse.json({ error: 'Failed to check auth users' }, { status: 500 });
    }

    const existingAuthUser = authUsers.users.find(user => user.email === email.toLowerCase());
    
    if (existingAuthUser) {
      console.log('Sync-user - User already exists in auth system:', existingAuthUser.id);
      return NextResponse.json({ 
        message: 'User already exists in auth system',
        userId: existingAuthUser.id 
      });
    }

    console.log('Sync-user - Creating user in auth system');

    // Create user in auth system
    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        display_name: existingUser.display_name,
        job_title: existingUser.job_title,
        role: existingUser.role,
        avatar_url: existingUser.avatar_url,
      }
    });

    if (createError) {
      console.error('Sync-user - Error creating auth user:', createError);
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 });
    }

    console.log('Sync-user - User created successfully in auth system:', authData.user.id);

    return NextResponse.json({ 
      message: 'User synced successfully',
      userId: authData.user.id 
    });

  } catch (error) {
    console.error('Sync-user - Error in sync-user route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
