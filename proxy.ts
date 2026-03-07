import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      const user = sessionResponse.data;

      const setCookieHeader = sessionResponse.headers["set-cookie"];

      if (setCookieHeader) {
        const cookiesArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        cookiesArray.forEach((cookieString) => {
          const parsedCookie = parse(cookieString);
          const [name, value] = Object.entries(parsedCookie)[0] ?? [];

          if (name && value) {
            response.cookies.set(name, value);
          }
        });
      }

      isAuthenticated = Boolean(user);
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
