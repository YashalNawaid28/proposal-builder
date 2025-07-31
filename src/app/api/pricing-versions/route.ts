import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    const { job_id, creator_id } = await request.json();

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
      console.error("Error creating pricing version:", error);
      return NextResponse.json(
        { error: "Failed to create pricing version" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in pricing versions POST:", error);
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
    const job_id = searchParams.get("job_id");

    if (!job_id) {
      return NextResponse.json(
        { error: "job_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pricing_versions")
      .select("*")
      .eq("job_id", job_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pricing versions:", error);
      return NextResponse.json(
        { error: "Failed to fetch pricing versions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in pricing versions GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 