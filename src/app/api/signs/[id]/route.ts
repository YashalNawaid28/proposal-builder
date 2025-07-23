import { NextRequest, NextResponse } from 'next/server';
import { supabase, setUserIdSessionVar } from '../../../../lib/supabase';

// GET a single sign by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await setUserIdSessionVar(supabase, userId);
    const id = params.id;
    const { data, error } = await supabase
      .from('signs')
      .select('*, brand:brands(user_id)')
      .eq('id', id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Sign not found' }, { status: 404 });
    }
    if (data.brand.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { brand, ...signData } = data;
    return NextResponse.json({ data: signData });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH (update) a sign
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await setUserIdSessionVar(supabase, userId);
    const id = params.id;
    const formData = await request.formData();
    const { data: existingSign, error: fetchError } = await supabase
      .from('signs')
      .select('*, brand:brands(user_id)')
      .eq('id', id)
      .single();
    if (fetchError || !existingSign) {
      return NextResponse.json({ error: 'Sign not found' }, { status: 404 });
    }
    if (existingSign.brand.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const updateData: any = {};
    if (formData.has('sign_name')) updateData.sign_name = formData.get('sign_name');
    if (formData.has('sign_description')) updateData.sign_description = formData.get('sign_description');
    if (formData.has('status')) updateData.status = formData.get('status');
    // (Image upload logic omitted for brevity)
    const { data, error } = await supabase
      .from('signs')
      .update(updateData)
      .eq('id', id)
      .select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a sign
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await setUserIdSessionVar(supabase, userId);
    const id = params.id;
    const { data: existingSign, error: fetchError } = await supabase
      .from('signs')
      .select('*, brand:brands(user_id)')
      .eq('id', id)
      .single();
    if (fetchError || !existingSign) {
      return NextResponse.json({ error: 'Sign not found' }, { status: 404 });
    }
    if (existingSign.brand.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { error } = await supabase
      .from('signs')
      .delete()
      .eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
