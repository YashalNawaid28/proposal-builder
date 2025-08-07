import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const allParams = Object.fromEntries(requestUrl.searchParams.entries());
  
  console.log("=== MAGIC LINK TEST ===");
  console.log("Full URL:", request.url);
  console.log("All parameters:", allParams);
  console.log("User Agent:", request.headers.get("user-agent"));
  console.log("Referer:", request.headers.get("referer"));
  console.log("=== END TEST ===");
  
  return NextResponse.json({
    message: "Magic link test endpoint",
    url: request.url,
    params: allParams,
    headers: {
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    }
  });
} 