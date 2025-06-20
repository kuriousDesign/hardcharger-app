export { auth as default } from "./auth";


export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and specific static files
    '/((?!_next/static|_next/image|.*\\.(?:jpg|jpeg|png|gif|svg|ico|webp|woff2?|ttf)).*)',
    // Always run for API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};

// Define public routes (accessible without authentication)
export const isPublicRoute = [
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
export const isAdminRoute = [
  '/admin(.*)',          // All /admin routes (e.g., /admin/drivers, /admin/events)
];



// export default oldMiddleware(async (auth) => {

//   // Protect non-public routes
//   if (!isPublicRoute(req)) await auth.protect();

//   // Protect admin routes with role check
//   if (isAdminRoute(req)) {
//     if (!getIsAdmin()){
//       // Redirect to dashboard if logged in, else to home
//       const redirectUrl = new URL(getLinks().getDashboardUrl(), req.url);
//       return NextResponse.redirect(redirectUrl);
//     }
//   }
// });

