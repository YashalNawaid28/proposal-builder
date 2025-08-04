import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServerSupabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "option_value_id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { display_label, price_modifier_value, price_modifier_type } = body;

    // Validate required fields
    if (!display_label) {
      return NextResponse.json(
        { error: "display_label is required" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      display_label,
    };

    // Only update price_modifier_value if it's provided
    if (price_modifier_value !== undefined && price_modifier_value !== null) {
      updateData.price_modifier_value = parseFloat(price_modifier_value);
    }

    // Only update price_modifier_type if it's provided
    if (price_modifier_type) {
      updateData.price_modifier_type = price_modifier_type;
    }

    const { data, error } = await supabase
      .from("option_values")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating option value:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data[0] }, { status: 200 });
  } catch (error) {
    console.error("PUT /option-values/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServerSupabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "option_value_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("option_values")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /option-values/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 