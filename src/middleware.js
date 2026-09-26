import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function isUnderConstruction() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?key=eq.under_construction&select=value`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return false;
    const rows = await res.json();
    return rows?.[0]?.value === true;
  } catch {
    // If the setting can't be read, keep the site live
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const enabled = await isUnderConstruction();

  if (pathname === "/under-construction") {
    return enabled
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", request.url));
  }

  if (enabled) {
    return NextResponse.rewrite(new URL("/under-construction", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Public pages only: skip dashboard, auth, API, Next internals and static files
  matcher: [
    "/((?!dashboard|auth|api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
