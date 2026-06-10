import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createClient> | undefined;
};

const RETRYABLE_CODES = new Set(["P1001", "P1002", "P1017"]);
const MAX_QUERY_RETRIES = 3;

function isRetryableDbError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRYABLE_CODES.has(err.code);
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  if (err instanceof Error && err.message.includes("Can't reach database server")) {
    return true;
  }
  return false;
}

function createClient() {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return base.$extends({
    query: {
      async $allOperations({ args, query }) {
        let lastError: unknown;
        for (let attempt = 0; attempt < MAX_QUERY_RETRIES; attempt++) {
          try {
            return await query(args);
          } catch (err) {
            lastError = err;
            if (!isRetryableDbError(err) || attempt === MAX_QUERY_RETRIES - 1) {
              throw err;
            }
            await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          }
        }
        throw lastError;
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function wakeDatabase(retries = 4, timeoutMs = 15_000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), timeoutMs)
        ),
      ]);
      return true;
    } catch {
      if (attempt === retries) return false;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  return false;
}

export * from "@prisma/client";
