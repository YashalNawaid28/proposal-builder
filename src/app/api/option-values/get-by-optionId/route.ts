import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const { searchParams } = new URL(request.url);
    const option_id = searchParams.get("option_id");

    if (!option_id) {
      return NextResponse.json(
        { error: "option_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("option_values")
      .select("*")
      .eq("option_id", option_id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("/api/option-values/get-by-optionId error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 