import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const allParams = Object.fromEntries(requestUrl.searchParams.entries());
  
  console.log("=== MAGIC LINK DEBUG ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Full URL:", request.url);
  console.log("All parameters:", allParams);
  console.log("Headers:", Object.fromEntries(request.headers.entries()));
  console.log("=== END DEBUG ===");
  
  return NextResponse.json({
    message: "Magic link debug endpoint",
    timestamp: new Date().toISOString(),
    url: request.url,
    params: allParams,
    headers: Object.fromEntries(request.headers.entries())
  });
} 