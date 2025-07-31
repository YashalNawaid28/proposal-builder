import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    const { pricing_version_id, sign_id, description_resolved, qty, list_price, cost_budget, list_install_price, cost_install_budget } = await request.json();

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
      console.error("Error creating pricing line:", error);
      return NextResponse.json(
        { error: "Failed to create pricing line" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in pricing lines POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    const { searchParams } = new URL(request.url);
    const pricing_version_id = searchParams.get("pricing_version_id");

    if (!pricing_version_id) {
      return NextResponse.json(
        { error: "pricing_version_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pricing_lines")
      .select(`
        *,
        signs (
          id,
          sign_name,
          sign_image
        )
      `)
      .eq("pricing_version_id", pricing_version_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pricing lines:", error);
      return NextResponse.json(
        { error: "Failed to fetch pricing lines" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in pricing lines GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 