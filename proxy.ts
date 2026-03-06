import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicAuthRoutes = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const hasToken =
    request.cookies.has("token") ||
    request.cookies.has("accessToken") ||
    request.cookies.has("refreshToken");

  if (isPrivateRoute && !hasToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicAuthRoute && hasToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
