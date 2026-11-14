import { accountDb } from "../src/backend/db/accountClient";
import { comparePassword } from "../src/backend/auth/password";
import { createToken, verifyToken } from "../src/lib/jwt";

async function testAdminLogin() {
  console.log("=== VERIFIKASI LOGIN AKUN ADMINISTRATOR ===");
  const email = "admin@zyba.id";
  const password = "AdminZyba2026!";

  const user = await accountDb.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User admin@zyba.id tidak ditemukan di database!");
  }
  console.log("[OK] User ditemukan di database:", user.id, user.email, "Role:", user.role);

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Password hash tidak cocok!");
  }
  console.log("[OK] Verifikasi password berhasil!");

  const token = await createToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
  });
  console.log("[OK] Token JWT berhasil dibuat:", token.substring(0, 25) + "...");

  const verified = await verifyToken(token);
  if (!verified || verified.role !== "ADMIN") {
    throw new Error("Token payload role bukan ADMIN!");
  }
  console.log("[OK] Sesi terverifikasi sebagai ADMIN:", {
    sub: verified.sub,
    email: verified.email,
    name: verified.name,
    role: verified.role,
    onboardingCompleted: verified.onboardingCompleted,
  });

  console.log("\n[TEST LULUS] Akun Administrator ZYBA 100% valid dan siap digunakan!");
  await accountDb.$disconnect();
}

testAdminLogin().catch((err) => {
  console.error("Test Gagal:", err);
  process.exit(1);
});
