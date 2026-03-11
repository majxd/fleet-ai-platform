import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

/** Auth-related path patterns */
const authPages = ["/login", "/register"];
const protectedPages = ["/dashboard", "/vehicles", "/alerts", "/reports", "/settings"];

/**
 * Middleware — handles i18n routing + auth guards.
 *
 * Currently permissive (no real Supabase session check).
 * When Supabase credentials are configured:
 *   1. Check for auth session cookie
 *   2. Unauthenticated + protected route → redirect to /login
 *   3. Authenticated + auth page → redirect to /dashboard
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to check route type
  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "");

  const isAuthPage = authPages.some((page) => pathnameWithoutLocale.startsWith(page));
  const isProtectedPage = protectedPages.some((page) => pathnameWithoutLocale.startsWith(page));

  // TODO: Replace with real Supabase session check
  // const supabaseSession = request.cookies.get("sb-session")?.value;
  // const isAuthenticated = !!supabaseSession;
  const isAuthenticated = false; // Permissive — allow all routes for now

  // When real auth is enabled, uncomment these:
  // if (!isAuthenticated && isProtectedPage) {
  //   const locale = pathname.match(/^\/(ar|en)/)?.[1] ?? defaultLocale;
  //   return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  // }
  // if (isAuthenticated && isAuthPage) {
  //   const locale = pathname.match(/^\/(ar|en)/)?.[1] ?? defaultLocale;
  //   return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  // }

  // Suppress unused variable warnings — these are used in commented auth logic above
  void isAuthPage;
  void isProtectedPage;
  void isAuthenticated;

  // Run next-intl middleware for locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
