import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

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
      // Try multiple size formats to handle different quote characters
      const sizeVariations = [
        size, // Original size
        size.replace(/["″]/g, ''), // Remove quotes
        `${size.replace(/["″]/g, '')}″`, // Add Unicode quote
        `${size.replace(/["″]/g, '')}"`, // Add regular quote
        size.replace(/″/g, '"'), // Replace Unicode quote with regular quote
        size.replace(/"/g, '″'), // Replace regular quote with Unicode quote
      ];
      
      console.log("API Debug - Size variations to try:", sizeVariations);
      
      // Use OR condition to try multiple size formats
      query = query.or(sizeVariations.map(s => `size.eq.${s}`).join(','));
    }

    const { data, error } = await query;

    console.log("API Debug - Final query result:", { data, error });

    if (error) {
      console.error("API Debug - Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no data found with size filter, try without size filter
    if (!data || data.length === 0) {
      console.log("API Debug - No data found with size filter, trying without size filter");
      
      const { data: dataWithoutSize, error: errorWithoutSize } = await supabase
        .from("sign_pricing")
        .select("*")
        .eq("sign_id", sign_id);
      
      console.log("API Debug - Data without size filter:", dataWithoutSize);
      
      if (errorWithoutSize) {
        console.error("API Debug - Error without size filter:", errorWithoutSize);
        return NextResponse.json({ error: errorWithoutSize.message }, { status: 500 });
      }
      
      return NextResponse.json({ 
        data: dataWithoutSize,
        note: "No exact size match found, returning all sizes for this sign"
      });
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
