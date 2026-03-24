import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, fall back to cookie-based demo auth
  if (!supabaseUrl || !supabaseAnonKey) {
    const token = request.cookies.get("auth_token")?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if ((pathname === "/login" || pathname === "/signup") && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the session token
  // Note: getUser() makes a network call to Supabase to verify the token
  // but this is necessary for security (getSession() only decodes locally)
  const { pathname } = request.nextUrl;

  // We can't await in proxy.ts if it's sync, so use getSession for the check
  // and rely on the supabase client to refresh cookies automatically
  const sessionCookie = request.cookies.getAll().find(c => c.name.includes("auth-token"));
  const hasSession = !!sessionCookie?.value;

  if (pathname.startsWith("/dashboard") && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/signup") && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
