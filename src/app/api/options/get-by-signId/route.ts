import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const { searchParams } = new URL(request.url);
    const signId = searchParams.get("sign_id");

    if (!signId) {
      return NextResponse.json(
        { error: "Missing sign_id in query" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase
      .from("options")
      .select("*")
      .eq("sign_id", signId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
