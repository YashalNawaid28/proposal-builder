import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sign_id, sign_budget_multiplier, install_budget_multiplier } = body;

    if (!sign_id) {
      return NextResponse.json({ error: 'Sign ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    
    // Only include fields that are provided
    if (sign_budget_multiplier !== undefined) updateData.sign_budget_multiplier = sign_budget_multiplier;
    if (install_budget_multiplier !== undefined) updateData.install_budget_multiplier = install_budget_multiplier;

    const { data, error } = await supabase
      .from('signs')
      .update(updateData)
      .eq('id', sign_id)
      .select();

    if (error) {
      console.error('Error updating sign multipliers:', error);
      return NextResponse.json({ error: 'Failed to update sign multipliers' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in update-multipliers route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 