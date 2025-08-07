import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()

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
