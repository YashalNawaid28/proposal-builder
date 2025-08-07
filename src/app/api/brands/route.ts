import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching brands:', error);
      return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in brands route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand_name, description, logo_url } = body;

    // Validate required fields
    if (!brand_name) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brands')
      .insert({
        brand_name,
        description: description || null,
        logo_url: logo_url || null,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error creating brand:', error);
      return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in brands POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
