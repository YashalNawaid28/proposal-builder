import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const protectedRoutes = ["/jobs", "/users", "/signs", "/options", "/brands"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  if (session) {
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();
    if (error || !existingUser) {
      console.log("Middleware - User not found in database, signing out");
      await supabase.auth.signOut();
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.searchParams.set("error", "access_denied");
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate"
      );
      return response;
    }
    await supabase
      .from("users")
      .update({ last_active_at: new Date().toISOString() })
      .eq("email", session.user.email);
    if (!session.user.user_metadata?.user_id) {
      await supabase.auth.updateUser({
        data: {
          user_id: existingUser.id,
          display_name: existingUser.display_name,
          job_title: existingUser.job_title,
          role: existingUser.role,
          avatar_url: existingUser.avatar_url,
          status: existingUser.status,
        },
      });
    }
    if (
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname === "/"
    ) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/jobs";
      return NextResponse.redirect(redirectUrl);
    }
  }
  res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
