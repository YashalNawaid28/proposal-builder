import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, setUserIdSessionVar } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    

    const supabase = getServerSupabase();

    const { searchParams } = new URL(request.url);
    const brand_id = searchParams.get('brand_id');

    if (!brand_id) {
      return NextResponse.json({ error: 'brand_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('signs')
      .select('*')
      .eq('brand_id', brand_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('/api/signs/get-by-brandId error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
