import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envCandidates = [
  path.resolve(__dirname, "../.env"),
  path.resolve(process.cwd(), "apps/api/.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
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
  flutterwave: {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY?.trim() ?? "",
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY?.trim() ?? "",
    webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET?.trim() ?? "",
    encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY?.trim() ?? "",
  },
  stakingRewards: {
    enabled: process.env.STAKING_REWARDS_ENABLED !== "false",
    intervalHours: parseFloat(process.env.STAKING_REWARD_INTERVAL_HOURS ?? "24"),
    runOnStart: process.env.STAKING_REWARD_RUN_ON_START === "true",
  },
};

export function isFlutterwaveConfigured() {
  return Boolean(config.flutterwave.secretKey);
}
