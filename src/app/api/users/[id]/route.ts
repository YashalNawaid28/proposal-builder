import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServerSupabase();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Get the user by ID
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("GET /users/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServerSupabase();
    
    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    // Add fields that are provided in the request
    if (body.display_name !== undefined) {
      updateData.display_name = body.display_name;
    }
    if (body.email !== undefined) {
      updateData.email = body.email;
    }
    if (body.job_title !== undefined) {
      updateData.job_title = body.job_title;
    }
    if (body.role !== undefined) {
      updateData.role = body.role;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.avatar_url !== undefined) {
      updateData.avatar_url = body.avatar_url;
    }
    
    // Update the user
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
    
  } catch (error) {
    console.error("PATCH /users/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 