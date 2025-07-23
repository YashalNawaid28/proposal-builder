// app/api/brands/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { setUserIdSessionVar } from '../../../../lib/supabase';

// GET a single brand by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await setUserIdSessionVar(supabase, userId);
    const id = params.id;
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Brand not found' }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH a brand
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const id = params.id;
    const formData = await request.formData();
    const updateData: any = {};
    if (formData.has('brand_name')) updateData.brand_name = formData.get('brand_name');
    if (formData.has('proposal_label')) updateData.proposal_label = formData.get('proposal_label');
    if (formData.has('services_number')) updateData.services_number = parseInt(formData.get('services_number') as string);
    if (formData.has('status')) updateData.status = formData.get('status');
    // (Image upload logic omitted for brevity)
    const { data, error } = await supabase
      .from('brands')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a brand
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const id = params.id;
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}