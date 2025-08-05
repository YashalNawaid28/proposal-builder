import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in users route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { display_name, email, job_title, role, avatar_url } = body;

    // Validate required fields
    if (!display_name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        display_name,
        email,
        job_title: job_title || null,
        role: role || 'employee',
        avatar_url: avatar_url || null,
        status: 'active',
        last_active_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in users POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
