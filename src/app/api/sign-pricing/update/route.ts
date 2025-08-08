import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('sign-pricing/update - Received body:', body);

    // Handle both old format (signId, pricingData) and new format (direct pricing data with id)
    let pricingData;
    let signId;

    if (body.signId && body.pricingData) {
      // Old format
      signId = body.signId;
      pricingData = body.pricingData;
    } else if (body.id) {
      // New format - the body contains the pricing data directly
      pricingData = body;
      // Extract sign_id from the pricing record if needed
      signId = body.sign_id;
    } else {
      return NextResponse.json({ error: 'Invalid request format. Either provide signId and pricingData, or provide pricing data with id' }, { status: 400 });
    }

    if (!pricingData) {
      return NextResponse.json({ error: 'Pricing data is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // If we have an id, update by id, otherwise update by sign_id
    let query;
    if (pricingData.id) {
      query = supabase
        .from('sign_pricing')
        .update(pricingData)
        .eq('id', pricingData.id)
        .select();
    } else if (signId) {
      query = supabase
        .from('sign_pricing')
        .update(pricingData)
        .eq('sign_id', signId)
        .select();
    } else {
      return NextResponse.json({ error: 'Either id or signId is required' }, { status: 400 });
    }

    const { data, error } = await query;

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