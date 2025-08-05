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
          sign_pricing (*)
        )
      `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Helper function to extract number from image URL
    const getImageNumber = (imageUrl: string) => {
      const decodedUrl = decodeURIComponent(imageUrl);
      const regex = /sign\s*\((\d+)\)/;
      const match = regex.exec(decodedUrl);
      return match ? parseInt(match[1], 10) : null;
    };

    // 👇 Reorder signs for each brand
    const PINNED_SIGN_ID = "0368b19e-4b92-4c2f-afe9-0b4e2d5b2c69";

    const reordered = data.map((brand: any) => {
      if (!brand.signs || !Array.isArray(brand.signs)) return brand;

      const pinned = brand.signs.find((s: any) => s.id === PINNED_SIGN_ID);
      const others = brand.signs.filter((s: any) => s.id !== PINNED_SIGN_ID);

      // Sort the remaining signs based on image number
      const itemsWithNumbers = others.filter(
        (item: any) => getImageNumber(item.sign_image || "") !== null
      );
      const itemsWithoutNumbers = others.filter(
        (item: any) => getImageNumber(item.sign_image || "") === null
      );

      const sortedItemsWithNumbers = itemsWithNumbers.sort((a: any, b: any) => {
        const aNumber = getImageNumber(a.sign_image || "")!;
        const bNumber = getImageNumber(b.sign_image || "")!;
        return aNumber - bNumber;
      });

      return {
        ...brand,
        signs: pinned ? [pinned, ...sortedItemsWithNumbers, ...itemsWithoutNumbers] : [...sortedItemsWithNumbers, ...itemsWithoutNumbers]
      };
    });

    return NextResponse.json({ data: reordered }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("GET /brands error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}