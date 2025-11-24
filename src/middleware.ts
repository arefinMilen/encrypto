import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Redirect unauthorized users from the /dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const isAuthenticated = request.cookies.get('auth_token');

    if (!isAuthenticated) {
      // Redirect to the login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow the request to continue if no conditions are met
  return NextResponse.next();
}

// Optionally, define a matcher to only run middleware on specific paths
export const config = {
  matcher: ['sign-in',
    'sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
};