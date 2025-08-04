import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase.from("signs").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const getImageNumber = (imageUrl: string) => {
      const decodedUrl = decodeURIComponent(imageUrl);
      const regex = /sign\s*\((\d+)\)/;
      const match = regex.exec(decodedUrl);
      return match ? parseInt(match[1], 10) : null;
    };

    const itemsWithNumbers = data.filter(
      (item) => getImageNumber(item.sign_image || "") !== null
    );
    const itemsWithoutNumbers = data.filter(
      (item) => getImageNumber(item.sign_image || "") === null
    );

    const sortedData = itemsWithNumbers.toSorted((a, b) => {
      const aNumber = getImageNumber(a.sign_image || "")!;
      const bNumber = getImageNumber(b.sign_image || "")!;
      return aNumber - bNumber;
    });

    return NextResponse.json({ data: [...sortedData, ...itemsWithoutNumbers] });
  } catch (error) {
    console.error("GET /signs/get-all error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
