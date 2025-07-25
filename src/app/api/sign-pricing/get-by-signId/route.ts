import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, setUserIdSessionVar } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('request.user.id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const signId = searchParams.get('sign_id');

    if (!signId) {
      return NextResponse.json({ error: 'Missing sign_id in query' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);


    const { data, error } = await supabase
      .from('sign_pricing')
      .select('*')
      .eq('sign_id', signId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error fetching sign pricing:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
