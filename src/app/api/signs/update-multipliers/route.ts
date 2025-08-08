import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('update-multipliers - Received body:', body);

    // Handle the actual data structure being sent
    const { sign_id, sign_budget_multiplier, install_budget_multiplier } = body;

    if (!sign_id) {
      return NextResponse.json({ error: 'Sign ID is required' }, { status: 400 });
    }

    // Build the update object with only the fields that are provided
    const updateData: any = {};
    if (sign_budget_multiplier !== undefined) {
      updateData.sign_budget_multiplier = sign_budget_multiplier;
    }
    if (install_budget_multiplier !== undefined) {
      updateData.install_budget_multiplier = install_budget_multiplier;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No multiplier data provided' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('signs')
      .update(updateData)
      .eq('id', sign_id)
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