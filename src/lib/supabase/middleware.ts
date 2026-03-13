import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // We need to keep the middleware in sync with the current URL
  const supabase = createServerClient<Database>(
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies, etc.
  
  // Refresh the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Extract locale from the path
  const pathname = request.nextUrl.pathname
  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
  const locale = localeMatch ? localeMatch[1] : 'ar'

  // Define public/auth paths that don't require login
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register')

  if (!user && !isAuthPage && pathname !== '/' && !pathname.match(/^\/[a-z]{2}\/?$/)) {
    // If not logged in and trying to access a protected route
    // Redirect to login (preserving locale)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // If logged in and trying to access auth pages
    // Redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  // Return the customized response with updated cookies
  return supabaseResponse
}
