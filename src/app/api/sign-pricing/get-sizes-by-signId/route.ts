import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const { searchParams } = new URL(request.url);
    const sign_id = searchParams.get("sign_id");

    if (!sign_id) {
      return NextResponse.json(
        { error: "sign_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sign_pricing")
      .select("size")
      .eq("sign_id", sign_id)
      .order("size");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract just the size values and remove duplicates
    const sizes = [...new Set(data.map(item => item.size))];

    return NextResponse.json({ data: sizes });
  } catch (error) {
    console.error("/api/sign-pricing/get-sizes-by-signId error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 