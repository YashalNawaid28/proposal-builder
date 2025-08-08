import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token')
  const error = requestUrl.searchParams.get('error')
  
  // Log all search parameters for debugging
  const allParams = Object.fromEntries(requestUrl.searchParams.entries())
  console.log("Callback - Full URL:", request.url)
  console.log("Callback - All search params:", allParams)
  console.log("Callback - URL params:", { code, token, error })

  if (error) {
    console.error("Auth error:", error)
    return NextResponse.redirect(
      new URL("/sign-in?error=auth_failed", request.url)
    )
  }

  // Handle both code and token parameters
  const authCode = code || token
  
  if (authCode) {
    const supabase = await createClient()
    try {
      console.log("Callback - Exchanging auth code for session")
      
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(authCode)
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError)
        return NextResponse.redirect(
          new URL("/sign-in?error=auth_failed", request.url)
        )
      }

      console.log("Callback - Session user email:", session.user.email)
      
      // Step 1: Get user data from users table (main source of truth)
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      console.log("Callback - User lookup result:", { existingUser, userError })

      if (userError || !existingUser) {
        console.log("Callback - User not found in database, signing out")
        await supabase.auth.signOut()
        return NextResponse.redirect(
          new URL("/sign-in?error=access_denied", request.url)
        )
      }

      // Step 2: Check if user is disabled
      if (existingUser.status === "Disabled") {
        console.log("Callback - User is disabled, signing out")
        await supabase.auth.signOut()
        return NextResponse.redirect(
          new URL("/sign-in?error=account_disabled", request.url)
        )
      }

      // Step 3: Update last_active_at in users table
      await supabase
        .from("users")
        .update({ last_active_at: new Date().toISOString() })
        .eq("email", session.user.email)

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
      })

      console.log("Callback - Successfully authenticated user:", existingUser.display_name)
      
      // Redirect to a page that will set localStorage
      const redirectUrl = new URL("/set-user-role", request.url)
      redirectUrl.searchParams.set("role", existingUser.role || "")
      redirectUrl.searchParams.set("email", existingUser.email)
      return NextResponse.redirect(redirectUrl)
    } catch (error) {
      console.error("Callback error:", error)
      return NextResponse.redirect(
        new URL("/sign-in?error=auth_failed", request.url)
      )
    }
  }

  console.log("Callback - No auth code found, redirecting to sign-in")
  return NextResponse.redirect(new URL("/sign-in", request.url))
}
