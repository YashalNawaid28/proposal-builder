import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, setUserIdSessionVar } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {

    const supabase = getServerSupabase();


    const formData = await request.formData();
    const brand_id = formData.get("brand_id") as string;
    const sign_name = formData.get("sign_name") as string;
    const sign_description = formData.get("sign_description") as string;
    const status = (formData.get("status") as string) || "Draft";
    const sign_image_url = null;
    const { data, error } = await supabase
      .from("signs")
      .insert({
        brand_id,
        sign_name,
        sign_description,
        sign_image: sign_image_url,
        status,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /signs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from("brands")
      .select(`
        *,
        signs (
          *,
          sign_pricing (*),
          options (*)
        )
      `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 👇 Reorder signs for each brand
    const PINNED_SIGN_ID = "0368b19e-4b92-4c2f-afe9-0b4e2d5b2c69";

    const reordered = data.map((brand: any) => {
      if (!brand.signs || !Array.isArray(brand.signs)) return brand;

      const pinned = brand.signs.find((s: any) => s.id === PINNED_SIGN_ID);
      const others = brand.signs.filter((s: any) => s.id !== PINNED_SIGN_ID);

      return {
        ...brand,
        signs: pinned ? [pinned, ...others] : others
      };
    });

    return NextResponse.json({ data: reordered }, { status: 200 });
  } catch (error) {
    console.error("GET /brands error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}