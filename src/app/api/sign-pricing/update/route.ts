import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { signId, pricingData } = body;

    if (!signId || !pricingData) {
      return NextResponse.json(
        { error: "Sign ID and pricing data are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sign_pricing")
      .upsert(pricingData)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /sign-pricing/update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 