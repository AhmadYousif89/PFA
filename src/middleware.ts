import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ENVSchema } from "./lib/load-env";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/demo")) {
    // Internally serve the same route without /demo
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/demo/, "") || "/";

    const res = NextResponse.redirect(url);

    res.cookies.set("demo", "1", {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      maxAge: ENVSchema.NODE_ENV === "production" ? 30 * 60 : 5 * 60,
      secure: ENVSchema.NODE_ENV === "production",
    });
    // Delete the onboarding cookie if it exists
    if (req.cookies.has("onboardingId")) {
      res.cookies.delete({
        name: "onboardingId",
        path: "/",
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/demo", "/demo/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
