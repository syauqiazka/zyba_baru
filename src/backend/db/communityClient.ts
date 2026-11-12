import { PrismaClient } from "@/generated/community-client";
import { resolveDatabaseUrl } from "./dbEnvSafety";

const globalForCommunityDb = globalThis as unknown as {
  communityDb?: PrismaClient;
};

const dbUrl = resolveDatabaseUrl(
  "DATABASE_URL_COMMUNITY",
  "DIRECT_URL_COMMUNITY",
  "zyba_community"
);

function withPoolConfig(url: string, limit = 5): string {
  if (url.includes("connection_limit=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connection_limit=${limit}&pool_timeout=10`;
}

export const communityDb =
  globalForCommunityDb.communityDb ??
  new PrismaClient({
    datasources: {
      db: {
        url: withPoolConfig(dbUrl, 5),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForCommunityDb.communityDb = communityDb;
}

