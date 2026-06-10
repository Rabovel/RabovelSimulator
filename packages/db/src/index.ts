import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createClient> | undefined;
  basePrisma: PrismaClient | undefined;
};

const RETRYABLE_CODES = new Set(["P1001", "P1002", "P1017", "P2024"]);
const MAX_QUERY_RETRIES = 3;

function isConnectionClosedError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("closed") ||
    msg.includes("connection terminated") ||
    msg.includes("server has closed") ||
    msg.includes("broken pipe") ||
    msg.includes("connection reset")
  );
}

function isRetryableDbError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRYABLE_CODES.has(err.code);
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return isConnectionClosedError(err);
  }
  if (err instanceof Error) {
    if (err.message.includes("Can't reach database server")) return true;
    if (isConnectionClosedError(err)) return true;
  }
  return false;
}

function createClient() {
  const base = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "error" },
            { emit: "event", level: "warn" },
          ]
        : [{ emit: "event", level: "error" }],
  });

  if (process.env.NODE_ENV === "development") {
    base.$on("warn", (e) => {
      if (!e.message.includes("Closed")) {
        console.warn(e.message);
      }
    });
    base.$on("error", (e) => {
      if (!e.message.includes("Closed")) {
        console.error(e.message);
      }
    });
  }

  globalForPrisma.basePrisma = base;

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
            if (isConnectionClosedError(err)) {
              await reconnectDatabase();
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

export async function reconnectDatabase() {
  const base = globalForPrisma.basePrisma;
  if (!base) return;
  try {
    await base.$disconnect();
  } catch {
    // ignore disconnect errors on dead connections
  }
  await base.$connect();
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
      if (attempt < retries) {
        await reconnectDatabase();
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  return false;
}

const KEEPALIVE_MS = 4 * 60 * 1000;
let keepaliveTimer: ReturnType<typeof setInterval> | null = null;

/** Prevents Neon/PgBouncer from closing idle pooled connections in long-running dev servers. */
export function startDatabaseKeepalive(intervalMs = KEEPALIVE_MS) {
  if (keepaliveTimer) return;
  keepaliveTimer = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      try {
        await reconnectDatabase();
        await prisma.$queryRaw`SELECT 1`;
      } catch {
        // next request or keepalive will retry
      }
    }
  }, intervalMs);
  keepaliveTimer.unref?.();
}

export function stopDatabaseKeepalive() {
  if (keepaliveTimer) {
    clearInterval(keepaliveTimer);
    keepaliveTimer = null;
  }
}

export * from "@prisma/client";
