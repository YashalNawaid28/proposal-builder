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
      new URL("/sign-in?error=auth_failed", request.url)
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
          new URL("/sign-in?error=auth_failed", request.url)
        );
      }

      console.log("Callback - Session user email:", session.user.email);
      
      // Step 1: Get user data from users table (main source of truth)
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      console.log("Callback - User lookup result:", { existingUser, userError });

      if (userError || !existingUser) {
        console.log("Callback - User not found in database, signing out");
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL("/sign-in?error=access_denied", request.url)
        );
      }

      // Step 2: Check if user is disabled
      if (existingUser.status === "Disabled") {
        console.log("Callback - User is disabled, signing out");
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL("/sign-in?error=account_disabled", request.url)
        );
      }

      // Step 3: Update last_active_at in users table
      await supabase
        .from("users")
        .update({ last_active_at: new Date().toISOString() })
        .eq("email", session.user.email);

      // Step 4: Save users table data in session metadata (main source of truth)
      await supabase.auth.updateUser({
        data: {
          user_id: existingUser.id,
          display_name: existingUser.display_name,
          job_title: existingUser.job_title,
          role: existingUser.role,
          avatar_url: existingUser.avatar_url,
          status: existingUser.status,
          email: existingUser.email, // Use email from users table
        },
      });

      console.log("Callback - Successfully authenticated user:", existingUser.display_name);
      return NextResponse.redirect(new URL("/jobs", request.url));
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(
        new URL("/sign-in?error=auth_failed", request.url)
      );
    }
  }

  return NextResponse.redirect(new URL("/sign-in", request.url));
}
