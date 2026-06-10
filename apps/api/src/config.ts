import dotenv from "dotenv";
import path from "path";
import fs from "fs";

function findRepoRoot(start = process.cwd()): string | null {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
          name?: string;
          workspaces?: unknown;
        };
        if (pkg.workspaces && pkg.name === "rabovel-simulator") {
          return dir;
        }
      } catch {
        // continue walking up
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const repoRoot = findRepoRoot();
const envCandidates = [
  path.resolve(__dirname, "../.env"),
  repoRoot ? path.join(repoRoot, "apps/api/.env") : null,
  path.resolve(process.cwd(), "apps/api/.env"),
  path.resolve(process.cwd(), "../api/.env"),
  path.resolve(process.cwd(), ".env"),
].filter((p): p is string => Boolean(p));

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

export const config = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin:
    process.env.CORS_ORIGIN ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
  nodeEnv: process.env.NODE_ENV ?? "development",
  get flutterwave() {
    return {
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY?.trim() ?? "",
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY?.trim() ?? "",
      webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET?.trim() ?? "",
      encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY?.trim() ?? "",
    };
  },
  stakingRewards: {
    enabled: process.env.STAKING_REWARDS_ENABLED !== "false",
    intervalHours: parseFloat(process.env.STAKING_REWARD_INTERVAL_HOURS ?? "24"),
    runOnStart: process.env.STAKING_REWARD_RUN_ON_START === "true",
  },
};

export function isFlutterwaveConfigured() {
  return Boolean(process.env.FLUTTERWAVE_SECRET_KEY?.trim());
}
