import { NextRequest, NextResponse } from "next/server";
import {
  getServerSupabase,
  setUserIdSessionVar,
} from "../../../../lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Brand not found" },
        { status: 404 }
      );
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

// PATCH a brand
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = getServerSupabase();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const formData = await request.formData();
    const updateData: Record<string, string | number> = {};
    if (formData.has("brand_name")) {
      const value = formData.get("brand_name");
      if (typeof value === "string") updateData.brand_name = value;
    }
    if (formData.has("proposal_label")) {
      const value = formData.get("proposal_label");
      if (typeof value === "string") updateData.proposal_label = value;
    }
    if (formData.has("services_number")) {
      const value = formData.get("services_number");
      if (typeof value === "string") updateData.services_number = parseInt(value);
    }
    if (formData.has("status")) {
      const value = formData.get("status");
      if (typeof value === "string") updateData.status = value;
    }
    // (Image upload logic omitted for brevity)
    const { data, error } = await supabase
      .from("brands")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select();
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

// DELETE a brand
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = getServerSupabase();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
