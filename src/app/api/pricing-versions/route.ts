import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const body = await request.json();
    const { job_id, creator_id } = body;

    if (!job_id || !creator_id) {
      return NextResponse.json(
        { error: "job_id and creator_id are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pricing_versions")
      .insert({
        job_id,
        version_no: 1,
        revision_no: 1,
        creator_id,
        status: "Draft",
        signed_at: null,
        generated_pdf_url: null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /pricing-versions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 