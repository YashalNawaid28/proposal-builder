import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  if (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=auth_failed", request.url)
    );
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(code);
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        return NextResponse.redirect(
          new URL("/auth/sign-in?error=auth_failed", request.url)
        );
      }
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("id, email, display_name")
        .eq("email", session.user.email)
        .single();
      if (userError || !existingUser) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL("/auth/sign-in?error=access_denied", request.url)
        );
      }
      return NextResponse.redirect(new URL("/jobs", request.url));
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(
        new URL("/auth/sign-in?error=auth_failed", request.url)
      );
    }
  }

  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}
