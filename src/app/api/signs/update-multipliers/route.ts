import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { signId, multipliers } = body;

    if (!signId || !multipliers) {
      return NextResponse.json({ error: 'Sign ID and multipliers are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('signs')
      .update({ multipliers })
      .eq('id', signId)
      .select();

    if (error) {
      console.error('Error updating multipliers:', error);
      return NextResponse.json({ error: 'Failed to update multipliers' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in update-multipliers route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 