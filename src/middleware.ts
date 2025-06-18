import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are public
const isPublicRoute = createRouteMatcher(["/", "/about", "/signin", "/signup"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect only non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect(); // Correct usage: call protect() directly on auth
  }
});
export const config = {
  matcher: ["/((?!static|_next|.*\\..*).*)"], // exclude static assets and Next internals
};
