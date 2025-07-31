import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const { searchParams } = new URL(request.url);
    const sign_id = searchParams.get("sign_id");
    const size = searchParams.get("size");

    console.log("API Debug - sign_id:", sign_id);
    console.log("API Debug - size:", size);

    if (!sign_id) {
      return NextResponse.json(
        { error: "sign_id is required" },
        { status: 400 }
      );
    }

    // First, let's see what data exists for this sign_id
    const { data: allDataForSign, error: allDataError } = await supabase
      .from("sign_pricing")
      .select("*")
      .eq("sign_id", sign_id);
    
    console.log("API Debug - All data for sign_id:", allDataForSign);
    console.log("API Debug - All data error:", allDataError);
    
    // Also let's see what sizes exist for this sign
    if (allDataForSign && allDataForSign.length > 0) {
      console.log("API Debug - Available sizes for this sign:", allDataForSign.map(item => item.size));
    }

    let query = supabase
      .from("sign_pricing")
      .select("*")
      .eq("sign_id", sign_id);

    // If size is provided, filter by size as well
    if (size) {
      // Remove any existing quotes and add the Unicode quote that's in the database
      const cleanSize = size.replace(/["″]/g, '');
      const sizeWithUnicodeQuote = `${cleanSize}″`;
      console.log("API Debug - Original size:", size);
      console.log("API Debug - Cleaned size:", cleanSize);
      console.log("API Debug - Searching for size:", sizeWithUnicodeQuote);
      query = query.eq("size", sizeWithUnicodeQuote);
    }

    const { data, error } = await query;

    console.log("API Debug - Final query result:", { data, error });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("/api/sign-pricing/get-by-signId error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
