import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { signId, pricingData } = body;

    if (!signId || !pricingData) {
      return NextResponse.json({ error: 'Sign ID and pricing data are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('sign_pricing')
      .update(pricingData)
      .eq('sign_id', signId)
      .select();

    if (error) {
      console.error('Error updating sign pricing:', error);
      return NextResponse.json({ error: 'Failed to update sign pricing' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in sign-pricing update route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 