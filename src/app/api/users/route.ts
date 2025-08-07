import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
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
    const supabase = await createClient();
    const body = await request.json();
    const { display_name, email, job_title, role, avatar_url } = body;

    // Validate required fields
    if (!display_name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: uuidv4(),
        display_name,
        email,
        job_title: job_title || null,
        role: role || 'employee',
        avatar_url: avatar_url || null,
        status: 'Active',
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
