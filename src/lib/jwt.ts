import { SignJWT, jwtVerify } from "jose";

export interface JWTPayload {
  sub: string; // userId
  email: string;
  name: string;
  role: string;
  onboardingCompleted: boolean;
}

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "zyba-super-secret-jwt-key-2026-development-fallback"
);

export async function createToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // 30 hari sesuai AGENTS.md D11
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
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

