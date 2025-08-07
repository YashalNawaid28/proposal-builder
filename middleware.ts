import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = await updateSession(request)

  // If the user is authenticated, perform additional validation
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    console.log("Middleware - Session found for email:", user.email);
    
    // Step 1: Get user data from users table (main source of truth)
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();
    
    console.log("Middleware - User lookup result:", { existingUser, error });
    
    if (error || !existingUser) {
      console.log("Middleware - User not found in database, signing out");
      await supabase.auth.signOut();
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.searchParams.set("error", "access_denied");
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate"
      );
      return response;
    }

    // Step 2: Check if user is disabled
    if (existingUser.status === "Disabled") {
      console.log("Middleware - User is disabled, signing out");
      await supabase.auth.signOut();
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.searchParams.set("error", "account_disabled");
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate"
      );
      return response;
    }

    // Step 3: Update last_active_at in users table
    await supabase
      .from("users")
      .update({ last_active_at: new Date().toISOString() })
      .eq("email", user.email);
    
    // Step 4: Ensure session metadata has users table data
    if (!user.user_metadata?.user_id) {
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
    }
    
    // Step 5: Redirect authenticated users away from sign-in page
    if (
      request.nextUrl.pathname.startsWith("/sign-in") ||
      request.nextUrl.pathname === "/"
    ) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/jobs";
      return NextResponse.redirect(redirectUrl);
    }
  }

  supabaseResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  supabaseResponse.headers.set("Pragma", "no-cache");
  supabaseResponse.headers.set("Expires", "0");
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
