import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const { searchParams } = new URL(request.url);
    const option_name = searchParams.get("option_name");

    if (!option_name) {
      return NextResponse.json(
        { error: "option_name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("options")
      .select("*")
      .eq("option_name", option_name)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("/api/options/get-by-name error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 