import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brand_id');

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
    }

    // Use the imported supabase client directly
    
    const { data, error } = await supabase
      .from('brands')
      .select('brand_name')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching brand:', error);
      return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in get-by-id route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 