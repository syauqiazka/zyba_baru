import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "zyba_token";
const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "zyba-super-secret-jwt-key-2026-development-fallback"
);

interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role?: string;
  onboardingCompleted?: boolean;
}

async function verifyEdgeToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) || "USER",
      onboardingCompleted: Boolean(payload.onboardingCompleted),
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "").trim();
  const session = token ? await verifyEdgeToken(token) : null;

  // Daftar rute terproteksi aplikasi (app)
  const appRoutes = [
    "/dashboard",
    "/mood-check-in",
    "/companion",
    "/activity",
    "/wellness-journey",
    "/community",
    "/resources",
    "/settings",
  ];

  const isAppRoute = appRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAssessmentRoute = pathname === "/assessment" || pathname.startsWith("/assessment/");
  const isAuthRoute = pathname === "/login" || pathname === "/onboarding";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  // 1. Perlindungan rute Admin (hanya role ADMIN)
  if (isAdminRoute) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Akses ke rute utama aplikasi (app)
  if (isAppRoute) {
    if (!session) {
      // Belum login -> redirect ke /login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!session.onboardingCompleted) {
      // Login tapi belum selesai asesmen -> paksa ke /assessment
      return NextResponse.redirect(new URL("/assessment", request.url));
    }
  }

  // 3. Akses ke rute /assessment
  if (isAssessmentRoute) {
    if (!session) {
      // Tidak ada sesi -> redirect ke /login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.onboardingCompleted) {
      // Sudah selesai asesmen -> redirect ke /dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 4. Akses ke halaman login / onboarding jika sudah ada sesi aktif
  if (isAuthRoute && session) {
    if (session.onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/assessment", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|screenshots|images).*)",
  ],
};
