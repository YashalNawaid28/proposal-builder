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

      // Get user data from users table
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (userError || !existingUser) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL("/auth/sign-in?error=access_denied", request.url)
        );
      }

      // Update last_active_at
      await supabase
        .from("users")
        .update({ last_active_at: new Date().toISOString() })
        .eq("email", session.user.email);

      // Update session metadata with user data
      await supabase.auth.updateUser({
        data: {
          user_id: existingUser.id,
          display_name: existingUser.display_name,
          job_title: existingUser.job_title,
          role: existingUser.role,
          avatar_url: existingUser.avatar_url,
          status: existingUser.status,
        }
      });

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
