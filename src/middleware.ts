import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Update Supabase session and handle auth redirects
  const supabaseResponse = await updateSession(request);

  // 2. If Supabase middleware returned a redirect, respect it and skip next-intl
  if (
    supabaseResponse.status !== 200 ||
    supabaseResponse.headers.has('x-middleware-redirect')
  ) {
    return supabaseResponse;
  }

  // 3. Run next-intl middleware for locale routing
  const intlResponse = intlMiddleware(request);

  // 4. Preserve Supabase cookies in the final response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
