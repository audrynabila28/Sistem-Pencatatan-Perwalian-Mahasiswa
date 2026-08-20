import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT USE getSession AS IT ONLY RETURNS THE SESSION DATA FROM THE CLIENT
  // WHICH MIGHT BE MANIPULATED BY A MALICIOUS USER.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Redirect users to login if they try to access protected routes without being logged in
  if (!user && pathname !== '/login' && pathname !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, verify their role and protect routes
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_default_password')
      .eq('id', user.id)
      .maybeSingle()

    const role = profile?.role
    const isDefaultPassword = profile?.is_default_password

    if (isDefaultPassword && pathname !== '/ganti-password') {
      return NextResponse.redirect(new URL('/ganti-password', request.url))
    }

    if (!isDefaultPassword && pathname === '/ganti-password') {
       return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirect to respective dashboards if accessing root or login
    if (pathname === '/' || pathname === '/login') {
      const url = request.nextUrl.clone()
      if (role === 'admin') url.pathname = '/admin'
      else if (role === 'mahasiswa') url.pathname = '/mahasiswa'
      else if (role === 'dosen') url.pathname = '/dosen'
      return NextResponse.redirect(url)
    }

    // Protect role-specific routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
       return NextResponse.redirect(new URL('/', request.url))
    }
    if (pathname.startsWith('/mahasiswa') && role !== 'mahasiswa') {
       return NextResponse.redirect(new URL('/', request.url))
    }
    if (pathname.startsWith('/dosen') && role !== 'dosen') {
       return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}
