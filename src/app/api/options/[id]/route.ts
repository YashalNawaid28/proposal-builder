import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase, setUserIdSessionVar } from '@/lib/supabase';

// GET a single option by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('request.user.id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);

    const id = params.id;
    const { data, error } = await supabase
      .from('options')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Option not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /options/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH (update) an option
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('request.user.id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);

    const id = params.id;
    const formData = await request.formData();

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
      } catch {
        values = valuesInput.split(',').map(v => v.trim());
      }
      updateData.values = values.length > 0 ? values : null;
    }

    const { data, error } = await supabase
      .from('options')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('PATCH /options/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an option
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('request.user.id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);

    const id = params.id;

    const { error } = await supabase
      .from('options')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /options/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
