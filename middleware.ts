import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected routes
  const protectedRoutes = ['/jobs', '/users', '/signs', '/options', '/brands']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  console.log('Middleware - Path:', req.nextUrl.pathname, 'Session:', !!session, 'Protected:', isProtectedRoute)

  // If no session and trying to access protected routes, redirect to sign-in
  if (!session && isProtectedRoute) {
    console.log('Middleware - Redirecting to sign-in')
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/sign-in'
    const response = NextResponse.redirect(redirectUrl)
    // Add cache control headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  // If session exists, verify user exists in database
  if (session) {
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    // If user doesn't exist in database, sign them out and redirect
    if (error || !existingUser) {
      console.log('Middleware - User not found in database, signing out')
      await supabase.auth.signOut()
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/sign-in'
      redirectUrl.searchParams.set('error', 'access_denied')
      const response = NextResponse.redirect(redirectUrl)
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      return response
    }

    // If session exists and trying to access auth pages, redirect to jobs
    if (req.nextUrl.pathname.startsWith('/auth/sign-in') || req.nextUrl.pathname === '/') {
      console.log('Middleware - Redirecting authenticated user to jobs')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/jobs'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Add cache control headers to all responses
  res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.headers.set('Pragma', 'no-cache')
  res.headers.set('Expires', '0')

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (to avoid conflicts)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
