import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Create response with cleared cookies
  const response = NextResponse.json({ message: 'Signed out successfully' })
  
  // Clear auth cookies
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')
  
  return response
}
