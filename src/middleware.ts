import { NextResponse } from 'next/server';
import { auth } from './auth';
import { NextAuthRequest } from 'next-auth';

// Define public routes (accessible without authentication)
const publicRoutes = [
  '/',                    // Home page
  '/test(.*)',
  '/sign-in(.*)',        // Sign-in routes
  '/sign-up(.*)',        // Sign-up routes
  '/api(.*)',            // API routes
  '/trpc(.*)',           // TRPC routes
  '/opengraph-image.png', // Open Graph image
  '/site.webmanifest',   // Web manifest
  '/favicon.ico',        // Favicon
  '/favicon-16x16.png',  // Shortcut icon
  '/apple-touch-icon.png', // Apple touch icon
];

// Define admin routes (requires admin role)
const adminRoutes = [
  '/admin(.*)',          // All /admin routes
];

// Helper to check if a route matches a pattern
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchesRoute(req: NextAuthRequest, patterns: any[]) {
  const pathname = req.nextUrl.pathname;
  return patterns.some(pattern => new RegExp(`^${pattern}$`).test(pathname));
}

export default auth(async (req) => {
  const session = req.auth; // Auth.js session
  const pathname = req.nextUrl.pathname;

  console.log('Middleware:', { pathname, user: session?.user?.id });

  // Redirect authenticated users from homepage to dashboard
  if (pathname === '/' && session?.user) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow public routes without authentication
  if (matchesRoute(req, publicRoutes)) {
    return NextResponse.next();
  }

  // Protect non-public routes
  if (!session?.user) {
    const signInUrl = new URL('/', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Protect admin routes
  if (matchesRoute(req, adminRoutes)) {
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/is-admin`, {
        headers: { Cookie: req.headers.get('cookie') || '' },
      });
      const { isAdmin } = await response.json();
      if (!isAdmin) {
        const dashboardUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    } catch (err) {
      console.error('Admin check error:', err);
      const signInUrl = new URL('/', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:jpg|jpeg|png|gif|svg|ico|webp|woff2?|ttf)).*)',
    '/(api|trpc)(.*)',
  ],
};