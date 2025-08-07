import { type NextRequest } from 'next/server'
// import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token')
  const error = requestUrl.searchParams.get('error')
  
  // Log all search parameters for debugging
  const allParams = Object.fromEntries(requestUrl.searchParams.entries())
  console.log('Callback - Full URL:', request.url)
  console.log('Callback - All search params:', allParams)
  console.log('Callback - URL params:', { code, token, error })

  if (error) {
    console.error('Auth error:', error)
    redirect('/sign-in?error=auth_failed')
  }

  const supabase = await createClient()

  // Try to exchange code for session if provided
  if (code || token) {
    try {
      console.log('Callback - Exchanging auth code for session')
      
      const authCode = code || token
      if (!authCode) {
        throw new Error('No auth code provided')
      }
      
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(authCode)
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        // Continue to session check even if exchange fails
      } else if (session) {
        console.log('Callback - Successfully exchanged code for session')
        return await handleAuthenticatedUser(supabase, session)
      }
    } catch (error) {
      console.error('Code exchange error:', error)
      // Continue to session check
    }
  }

  // Check for existing session (this is the main flow for magic links)
  console.log('Callback - Checking for existing session')
  
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session check error:', sessionError)
      redirect('/sign-in')
    }

    if (session && session.user) {
      console.log('Callback - Found existing session for:', session.user.email)
      return await handleAuthenticatedUser(supabase, session)
    }
  } catch (error) {
    console.error('Session check error:', error)
  }

  console.log('Callback - No session found, redirecting to sign-in')
  redirect('/sign-in')
}

async function handleAuthenticatedUser(supabase: any, session: any) {
  console.log('Callback - Processing authenticated user:', session.user.email)
  
  // Step 1: Get user data from users table (main source of truth)
  const { data: existingUser, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', session.user.email)
    .single()

  console.log('Callback - User lookup result:', { existingUser, userError })

  if (userError || !existingUser) {
    console.log('Callback - User not found in database, signing out')
    await supabase.auth.signOut()
    redirect('/sign-in?error=access_denied')
  }

  // Step 2: Check if user is disabled
  if (existingUser.status === 'Disabled') {
    console.log('Callback - User is disabled, signing out')
    await supabase.auth.signOut()
    redirect('/sign-in?error=account_disabled')
  }

  // Step 3: Update last_active_at in users table
  await supabase
    .from('users')
    .update({ last_active_at: new Date().toISOString() })
    .eq('email', session.user.email)

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

  console.log('Callback - Successfully authenticated user:', existingUser.display_name)
  redirect('/jobs')
}
