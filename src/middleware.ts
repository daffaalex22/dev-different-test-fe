import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const { data, error } = await supabase.auth.getSession()
  
  console.log('Session data:', data)
  console.log('Session error:', error)
  console.log('Full session object:', data?.session)

  console.log('Middleware - Current path:', req.nextUrl.pathname)
  console.log('Middleware - Session:', !!data?.session)

  // Don't redirect if we're on the callback page or processing auth
  if (req.nextUrl.pathname.startsWith('/auth/callback') || 
      req.nextUrl.searchParams.has('code') || 
      req.nextUrl.searchParams.has('error')) {
    console.log('Middleware - Allowing auth callback')
    return res
  }

  // Protect routes that require authentication
  if (req.nextUrl.pathname.startsWith('/properties')) {
    if (!data?.session) {
      console.log('Middleware - No session, redirecting to login')
      return NextResponse.redirect(new URL('/login', req.url))
    }
    console.log('Middleware - Session found, allowing access')
  }

  return res
}

export const config = {
  matcher: []
}



