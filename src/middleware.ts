import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const protectedRoutes = ["/admin", "/dashboard"]; // Define protected routes

  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Validate token by calling /api/user/profile
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: "GET",
        headers: { Cookie: `token=${token}` },
        credentials: "include",
      });
      
      if (!res.ok) {
        console.log("Token validation failed, redirecting to login");
        return NextResponse.redirect(new URL("/", req.url));
        
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // Protect /admin and /dashboard
};
