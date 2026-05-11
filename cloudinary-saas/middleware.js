import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/", "/home"])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware((auth, req) => {
    const {userId} = auth();
    const currrentUrl = new URL(req.url);
    const isAccessingDashboard = currrentUrl.pathname === "/home"
    const isAPIRequest = currrentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req) && !isAccessingDashboard){
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // not logged in
    if(!userId){
       //  if user is not logged in and trying to access a protectd route  /fix
       if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

         // if the request is for a protected API and the user is not logged in 
         if(isAPIRequest && isPublicApiRoute(req)){
          return NextResponse.redirect(new URL("/sign-in", req.url))
         }
    }

    return NextResponse.next();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}