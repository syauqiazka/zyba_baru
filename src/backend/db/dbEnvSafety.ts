/**
 * Database Environment Safety Module for ZYBA v2
 * 
 * Strict Environment Rules:
 * 1. In production runtime, explicit DATABASE_URL_* / DIRECT_URL_* is mandatory.
 *    Silent fallback to localhost is strictly prohibited to prevent data pollution or accidental local binding.
 * 2. In development or testing, explicit localhost fallback is allowed with clear diagnostic logging.
 * 3. During Next.js static build phase (phase-production-build), safe placeholder is used
 *    to prevent static page metadata collection from failing.
 */

export function resolveDatabaseUrl(
  envKey: string,
  directKey: string,
  fallbackDatabaseName: string
): string {
  const configuredUrl = process.env[envKey] || process.env[directKey];
  if (configuredUrl) {
    return configuredUrl;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const isBuildPhase =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.BUILDING === "true" ||
    process.env.NEXT_BUILD === "true";

  // Production runtime check: throw if running on live production server without configured database
  if (isProduction && !isBuildPhase) {
    if (process.env.NEXTAUTH_URL?.includes("zyba.my.id") && !process.env.ALLOW_LOCAL_FALLBACK) {
      const errorMsg =
        `[DATABASE_CONFIG_ERROR] Variabel lingkungan ${envKey} atau ${directKey} tidak ditemukan di environment production. ` +
        `Sistem ZYBA menolak fallback diam-diam ke localhost pada runtime production demi keamanan integritas data.`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    } else {
      console.warn(
        `[DATABASE_LOCAL_FALLBACK] ${envKey} tidak diset pada local production run. Menggunakan postgresql://localhost:5432/${fallbackDatabaseName}`
      );
      return `postgresql://postgres:postgres@localhost:5432/${fallbackDatabaseName}`;
    }
  }

  // Development / test explicit fallback
  if (!isProduction) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        `[DATABASE_DEV_FALLBACK] ${envKey} tidak diset. Menggunakan database lokal untuk development: postgresql://localhost:5432/${fallbackDatabaseName}`
      );
    }
    return `postgresql://postgres:postgres@localhost:5432/${fallbackDatabaseName}`;
  }

  // Static build phase placeholder (only executed during next build page collection)
  return `postgresql://postgres:postgres@localhost:5432/${fallbackDatabaseName}`;
}

