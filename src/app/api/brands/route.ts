import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, setUserIdSessionVar } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('request.user.id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServerSupabase();
  await setUserIdSessionVar(supabase, userId); 

  const { data, error } = await supabase
    .from('brands')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
