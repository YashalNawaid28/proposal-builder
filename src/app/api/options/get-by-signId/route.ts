import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, setUserIdSessionVar } from "@/lib/supabase";

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

    const { data: signData, error: signError } = await supabase
      .from("signs")
      .select("id, brand:brands(user_id)")
      .eq("id", signId)
      .single();

    if (
      signError ||
      !signData ||
      !Array.isArray(signData.brand) ||
      !signData.brand[0] ||
      signData.brand[0].user_id !== userId
    ) {
      return NextResponse.json(
        { error: "Sign not found or access denied" },
        { status: 403 }
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
