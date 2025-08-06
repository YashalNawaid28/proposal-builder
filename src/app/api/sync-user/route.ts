import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // First, check if user exists in our custom table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !existingUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Check if user already exists in auth system
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing auth users:', authError);
      return NextResponse.json({ error: 'Failed to check auth users' }, { status: 500 });
    }

    const existingAuthUser = authUsers.users.find(user => user.email === email.toLowerCase());
    
    if (existingAuthUser) {
      return NextResponse.json({ 
        message: 'User already exists in auth system',
        userId: existingAuthUser.id 
      });
    }

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
      console.error('Error creating auth user:', createError);
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'User synced successfully',
      userId: authData.user.id 
    });

  } catch (error) {
    console.error('Error in sync-user route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
