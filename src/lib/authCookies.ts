import { cookies, headers } from "next/headers";
import { verifyToken, VerifiedSession } from "./jwt";

export const AUTH_COOKIE_NAME = "zyba_token";

export function getAuthTokenFromCookies(): string | undefined {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (token) return token;

  try {
    const authHeader = headers().get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7).trim();
    }
  } catch {
    // Ignore header reading errors in edge contexts
  }

  return undefined;
}

export async function getAuthUser(): Promise<VerifiedSession | null> {
  const token = getAuthTokenFromCookies();
  if (!token) return null;
  return await verifyToken(token);
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  });
}

export function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

