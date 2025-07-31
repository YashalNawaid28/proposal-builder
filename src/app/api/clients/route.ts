import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase.from("clients").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /clients error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabase();
    
    const body = await request.json();
    
    // Extract client data from request body
    const {
      legal_name,
      street,
      city,
      state,
      postcode,
      country,
      client_contact,
      phone
    } = body;

    // Validate required fields
    if (!legal_name) {
      return NextResponse.json(
        { error: "Legal name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({
        legal_name,
        street,
        city,
        state,
        postcode,
        country,
        client_contact,
        phone
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /clients error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 