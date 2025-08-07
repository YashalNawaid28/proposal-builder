import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { signId, multipliers } = body;

    if (!signId || !multipliers) {
      return NextResponse.json(
        { error: "Sign ID and multipliers are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("signs")
      .update({ multipliers })
      .eq("id", signId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /signs/update-multipliers error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 