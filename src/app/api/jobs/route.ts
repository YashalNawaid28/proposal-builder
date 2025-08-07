import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in jobs route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, client_id, status } = body;

    // Validate required fields
    if (!title || !client_id) {
      return NextResponse.json({ error: 'Title and client are required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title,
        description: description || null,
        client_id,
        status: status || 'active',
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error creating job:', error);
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in jobs POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
