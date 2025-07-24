import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, setUserIdSessionVar } from "@/lib/supabase";

// GET a single sign by ID
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("request.user.id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const { data, error } = await supabase
      .from("signs")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Sign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /signs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH (update) a sign
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("request.user.id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const formData = await request.formData();

    const updateData: Record<string, unknown> = {};
    if (formData.has("sign_name"))
      updateData.sign_name = formData.get("sign_name");
    if (formData.has("sign_description"))
      updateData.sign_description = formData.get("sign_description");
    if (formData.has("status")) updateData.status = formData.get("status");
    // (Image upload logic can be added here)

    const { data, error } = await supabase
      .from("signs")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("PATCH /signs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE a sign
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("request.user.id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServerSupabase();
    await setUserIdSessionVar(supabase, userId);

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const { error } = await supabase.from("signs").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /signs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
