import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log("pricing-lines POST - Request received");
    const supabase = getServerSupabase();
    // Handle both JSON and FormData
    let body;
    const contentType = request.headers.get("content-type");
    console.log("pricing-lines POST - Content type:", contentType);

    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = {
        pricing_version_id: formData.get("pricing_version_id"),
        sign_id: formData.get("sign_id"),
        service_id: formData.get("service_id"),
        service_name: formData.get("service_name"),
        description_resolved: formData.get("description_resolved"),
        qty: formData.get("qty"),
        list_price: formData.get("price") || formData.get("list_price"),
        cost_budget: formData.get("cost_budget"),
        list_install_price: formData.get("list_install_price"),
        cost_install_budget: formData.get("cost_install_budget"),
        service_unit_price: formData.get("service_unit_price") || formData.get("price"),
      };
    }

    const {
      pricing_version_id,
      sign_id,
      service_id,
      service_name,
      description_resolved,
      qty,
      list_price,
      cost_budget,
      list_install_price,
      cost_install_budget,
      service_unit_price,
    } = body;
    
    console.log("pricing-lines POST - Parsed body:", {
      pricing_version_id,
      sign_id,
      service_id,
      service_name,
      description_resolved,
      qty,
      list_price,
      cost_budget,
      list_install_price,
      cost_install_budget,
      service_unit_price,
    });

    if (!pricing_version_id) {
      return NextResponse.json(
        { error: "pricing_version_id is required" },
        { status: 400 }
      );
    }

    // Determine if it's a sign or service based on which ID is provided
    const isSign = !!sign_id;
    const isService = !!service_id;

    // Validate that we have either sign_id or service_id, but not both
    if (!isSign && !isService) {
      return NextResponse.json(
        { error: "Either sign_id or service_id is required" },
        { status: 400 }
      );
    }

    if (isSign && isService) {
      return NextResponse.json(
        { error: "Cannot have both sign_id and service_id" },
        { status: 400 }
      );
    }

    // Validate pricing data based on type
    if (isSign) {
      // For signs, validate that we have at least some pricing data
      if (!list_price && !cost_budget && !list_install_price && !cost_install_budget) {
        return NextResponse.json(
          { error: "At least one price field is required for signs" },
          { status: 400 }
        );
      }
    } else if (isService) {
      // For services, validate that we have service_unit_price
      if (!service_unit_price || parseFloat(service_unit_price) <= 0) {
        return NextResponse.json(
          { error: "service_unit_price is required for services" },
          { status: 400 }
        );
      }
    }

    const insertData: any = {
      pricing_version_id,
      description_resolved:
        description_resolved || (isService ? service_name : ""),
      qty: parseInt(qty) || 1,
    };

    if (isSign) {
      // For signs, use the existing price fields
      insertData.list_price = parseFloat(list_price) || 0;
      insertData.cost_budget = parseFloat(cost_budget) || 0;
      insertData.list_install_price = parseFloat(list_install_price) || 0;
      insertData.cost_install_budget = parseFloat(cost_install_budget) || 0;
    } else if (isService) {
      // For services, use service_unit_price and set other fields to 0
      insertData.service_unit_price = parseFloat(service_unit_price) || 0;
      insertData.list_price = 0;
      insertData.cost_budget = 0;
      insertData.list_install_price = 0;
      insertData.cost_install_budget = 0;
    }

    // Only add sign_id if it's provided (for signs)
    if (sign_id) {
      insertData.sign_id = sign_id;
    }

    // Only add service_id if it's provided (for services)
    if (service_id) {
      insertData.service_id = service_id;
    }

    console.log("pricing-lines POST - Final insert data:", insertData);

    const { data, error } = await supabase
      .from("pricing_lines")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating pricing line:", error);
      return NextResponse.json(
        { 
          error: "Failed to create pricing line",
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in pricing lines POST:", error);
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
    const pricing_version_id = searchParams.get("pricing_version_id");

    if (!pricing_version_id) {
      return NextResponse.json(
        { error: "pricing_version_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pricing_lines")
      .select(
        `
        *,
        signs (
          id,
          sign_name,
          sign_image
        ),
        services (
          id,
          service_name,
          service_image,
          service_description
        )
      `
      )
      .eq("pricing_version_id", pricing_version_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching pricing lines:", error);
      return NextResponse.json(
        { error: "Failed to fetch pricing lines" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in pricing lines GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
