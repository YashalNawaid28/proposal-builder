import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, sign_price, install_price, sign_budget, install_budget, raceway } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    
    // Only include fields that are provided
    if (sign_price !== undefined) updateData.sign_price = sign_price;
    if (install_price !== undefined) updateData.install_price = install_price;
    if (sign_budget !== undefined) updateData.sign_budget = sign_budget;
    if (install_budget !== undefined) updateData.install_budget = install_budget;
    if (raceway !== undefined) updateData.raceway = raceway;

    const { data, error } = await supabase
      .from('sign_pricing')
      .update(updateData)
      .eq('id', id)
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