import { SignJWT, jwtVerify } from "jose";

export interface JWTPayload {
  sub: string; // userId
  userId?: string;
  email: string;
  name: string;
  role: string;
  onboardingCompleted: boolean;
}

export interface VerifiedSession extends JWTPayload {
  userId: string;
}

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "zyba-super-secret-jwt-key-2026-development-fallback"
);

export async function createToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload, userId: payload.userId || payload.sub })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // 30 hari sesuai AGENTS.md D11
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<VerifiedSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return {
      sub: payload.sub as string,
      userId: (payload.userId as string) || (payload.sub as string),
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) || "USER",
      onboardingCompleted: Boolean(payload.onboardingCompleted),
    };
  } catch {
    return null;
  }
}

