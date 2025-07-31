import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const body = await request.json();
    const { 
      pricing_version_id, 
      sign_id, 
      description_resolved, 
      qty, 
      list_price, 
      cost_budget, 
      list_install_price, 
      cost_install_budget 
    } = body;

    if (!pricing_version_id || !sign_id) {
      return NextResponse.json(
        { error: "pricing_version_id and sign_id are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pricing_lines")
      .insert({
        pricing_version_id,
        sign_id,
        description_resolved: description_resolved || "",
        qty: qty || 1,
        list_price,
        cost_budget,
        list_install_price,
        cost_install_budget,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /pricing-lines error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 