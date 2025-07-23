// app/api/options/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { setUserIdSessionVar } from '../../../../lib/supabase';

// GET a single option by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await setUserIdSessionVar(supabase, userId);
    const id = params.id;
    const { data: option, error } = await supabase
      .from('options')
      .select(`*, sign:signs(id, brand:brands(user_id))`)
      .eq('id', id)
      .single();
    if (error || !option) {
      return NextResponse.json({ error: error?.message || 'Option not found' }, { status: 404 });
    }
    let signGet = option.sign;
    if (Array.isArray(signGet)) signGet = signGet[0];
    let brandGet = signGet?.brand;
    if (Array.isArray(brandGet)) brandGet = brandGet[0];
    if (brandGet?.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { sign, ...optionData } = option;
    return NextResponse.json({ data: optionData });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH an option
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await setUserIdSessionVar(supabase, userId);
    const id = params.id;
    const formData = await request.formData();
    const { data: existingOption, error: fetchError } = await supabase
      .from('options')
      .select(`*, sign:signs(id, brand:brands(user_id))`)
      .eq('id', id)
      .single();
    if (fetchError || !existingOption) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }
    let signPatch = existingOption.sign;
    if (Array.isArray(signPatch)) signPatch = signPatch[0];
    let brandPatch = signPatch?.brand;
    if (Array.isArray(brandPatch)) brandPatch = brandPatch[0];
    if (brandPatch?.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const updateData: any = {};
    if (formData.has('option_name')) updateData.option_name = formData.get('option_name');
    if (formData.has('option_icon')) updateData.option_icon = formData.get('option_icon');
    if (formData.has('placeholder')) updateData.placeholder = formData.get('placeholder');
    if (formData.has('status')) updateData.status = formData.get('status');
    if (formData.has('input_type')) updateData.input_type = formData.get('input_type');
    if (formData.has('values')) {
      const valuesInput = formData.get('values') as string;
      let values: string[];
      try {
        values = JSON.parse(valuesInput);
      } catch (e) {
        values = valuesInput.split(',').map(v => v.trim());
      }
      updateData.values = values.length > 0 ? values : null;
    }
    const { data, error } = await supabase
      .from('options')
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

// DELETE an option
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await setUserIdSessionVar(supabase, userId);
    const id = params.id;
    const { data: existingOption, error: fetchError } = await supabase
      .from('options')
      .select(`id, sign:signs(id, brand:brands(user_id))`)
      .eq('id', id)
      .single();
    if (fetchError || !existingOption) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }
    let signDelete = existingOption.sign;
    if (Array.isArray(signDelete)) signDelete = (signDelete as any)[0];
    let brandDelete = (signDelete as any)?.brand;
    if (Array.isArray(brandDelete)) brandDelete = (brandDelete as any)[0];
    if ((brandDelete as any)?.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { error } = await supabase
      .from('options')
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