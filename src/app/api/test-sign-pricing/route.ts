import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const sign_id = searchParams.get("sign_id");

    console.log("Test API - Testing sign_pricing table access");
    console.log("Test API - sign_id:", sign_id);

    // Test 1: Check if we can access the table at all
    const { data: allData, error: allDataError } = await supabase
      .from("sign_pricing")
      .select("*")
      .limit(5);

    console.log("Test API - All data sample:", allData);
    console.log("Test API - All data error:", allDataError);

    // Test 2: Check if we can access by sign_id
    let signData = null;
    let signError = null;
    
    if (sign_id) {
      const { data, error } = await supabase
        .from("sign_pricing")
        .select("*")
        .eq("sign_id", sign_id);
      
      signData = data;
      signError = error;
      
      console.log("Test API - Sign-specific data:", signData);
      console.log("Test API - Sign-specific error:", signError);
    }

    // Test 3: Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from("sign_pricing")
      .select("sign_id, size")
      .limit(10);

    console.log("Test API - Table structure sample:", tableInfo);
    console.log("Test API - Table structure error:", tableError);

    return NextResponse.json({
      success: true,
      allDataSample: allData,
      allDataError: allDataError,
      signSpecificData: signData,
      signSpecificError: signError,
      tableStructureSample: tableInfo,
      tableStructureError: tableError,
      message: "Database connection test completed"
    });

  } catch (error) {
    console.error("Test API - Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 