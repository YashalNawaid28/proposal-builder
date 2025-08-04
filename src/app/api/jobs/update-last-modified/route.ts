import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json();
    
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const supabase = getServerSupabase();
    
    // Update the updated_at field to current timestamp
    const { data, error } = await supabase
      .from("jobs")
      .update({ 
        updated_at: new Date().toISOString() 
      })
      .eq("id", jobId)
      .select("updated_at")
      .single();

    if (error) {
      console.error("Error updating job updated_at:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Job updated_at updated successfully for jobId:", jobId, "new timestamp:", data.updated_at);

    return NextResponse.json({ 
      success: true, 
      updated_at: data.updated_at 
    });

  } catch (error) {
    console.error("POST /jobs/update-last-modified error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 