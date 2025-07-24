import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, setUserIdSessionVar } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('request.user.id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId); // ✅ enable session variable for RLS

    const formData = await request.formData();
    const brand_id = formData.get('brand_id') as string;
    const sign_name = formData.get('sign_name') as string;
    const sign_description = formData.get('sign_description') as string;
    const status = formData.get('status') as string || 'Draft';
    const signImage = formData.get('sign_image') as File;

    // Image upload logic can go here (if any)
    let sign_image_url = null;

    // ✅ Insert sign (RLS will check brand ownership automatically)
    const { data, error } = await supabase
      .from('signs')
      .insert({
        brand_id,
        sign_name,
        sign_description,
        sign_image: sign_image_url,
        status,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('POST /signs error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('request.user.id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId); // ✅ enable session variable for RLS

    const { searchParams } = new URL(request.url);
    const brand_id = searchParams.get('brand_id');

    let query = supabase.from('signs').select('*');

    if (brand_id) {
      query = query.eq('brand_id', brand_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /signs error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
