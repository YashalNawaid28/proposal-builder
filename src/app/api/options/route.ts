import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, setUserIdSessionVar } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('request.user.id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId); // ✅ Set session var for RLS

    const formData = await request.formData();
    const sign_id = formData.get('sign_id') as string;
    const option_name = formData.get('option_name') as string;
    const placeholder = formData.get('placeholder') as string;
    const input_type = formData.get('input_type') as 'Dropdown' | 'Input';
    const status = formData.get('status') as string || 'Active';
    const option_icon = formData.get('option_icon') as string;

    let values: string[] = [];
    if (input_type === 'Dropdown' && formData.has('values')) {
      const valuesInput = formData.get('values') as string;
      try {
        values = JSON.parse(valuesInput);
      } catch (e) {
        values = valuesInput.split(',').map(v => v.trim());
      }
    }

    const { data, error } = await supabase
      .from('options')
      .insert({
        sign_id,
        option_name,
        option_icon,
        placeholder,
        input_type,
        status,
        values: values.length > 0 ? values : null,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('POST /options error:', error);
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
    await setUserIdSessionVar(supabase, userId); // ✅ Set session var for RLS

    const { searchParams } = new URL(request.url);
    const sign_id = searchParams.get('sign_id');

    let query = supabase.from('options').select('*');

    if (sign_id) {
      query = query.eq('sign_id', sign_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /options error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
