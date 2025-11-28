import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({req: request});
  const url = request.nextUrl 


  if (token && 
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')  ||
      url.pathname.startsWith('/')
    )
  ){
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  // Example: Redirect unauthorized users from the /dashboard route
  // if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //   const isAuthenticated = request.cookies.get('auth_token');

  //   if (!isAuthenticated) {
  //     // Redirect to the login page
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  // }

  // Allow the request to continue if no conditions are met
  return NextResponse.redirect(new URL('/home', request.url))
}

// Optionally, define a matcher to only run middleware on specific paths
export const config = {
  matcher: ['/sign-in',
            '/sign-up',
            '/',
            '/dashboard/:path*',
            '/verify/:path*'
  ]
};