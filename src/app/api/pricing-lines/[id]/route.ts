import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabase();
    const { 
      list_price, 
      list_install_price, 
      cost_budget, 
      cost_install_budget, 
      description_resolved, 
      qty 
    } = await request.json();

    const { data, error } = await supabase
      .from("pricing_lines")
      .update({
        list_price,
        list_install_price,
        cost_budget,
        cost_install_budget,
        description_resolved,
        qty,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating pricing line:", error);
      return NextResponse.json(
        { error: "Failed to update pricing line" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in pricing lines PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabase();

    const { error } = await supabase
      .from("pricing_lines")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting pricing line:", error);
      return NextResponse.json(
        { error: "Failed to delete pricing line" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in pricing lines DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 