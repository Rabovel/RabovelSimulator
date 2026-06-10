import "./config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import kycRoutes from "./routes/kyc";
import walletRoutes from "./routes/wallet";
import portfolioRoutes from "./routes/portfolio";
import stakingRoutes from "./routes/staking";
import rewardsRoutes from "./routes/rewards";
import analyticsRoutes from "./routes/analytics";
import notificationsRoutes from "./routes/notifications";
import webhooksRoutes from "./routes/webhooks";
import adminKycRoutes from "./routes/admin/kyc";
import adminUsersRoutes from "./routes/admin/users";
import adminJobsRoutes from "./routes/admin/jobs";
import cronRoutes from "./routes/cron";

const app = express();

app.use(helmet());
const devOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3004",
];

app.use(
  cors({
    origin:
      config.nodeEnv === "development"
        ? (origin, callback) => {
            if (!origin || devOrigins.includes(origin) || origin === config.corsOrigin) {
              callback(null, true);
            } else {
              callback(null, false);
            }
          }
        : config.corsOrigin,
    credentials: true,
  })
);
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "rabovel-api" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "rabovel-api" });
});

app.use("/api/cron", cronRoutes);
app.use("/api/webhooks", webhooksRoutes);
app.use("/api/admin/kyc", adminKycRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/jobs", adminJobsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/staking", stakingRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use(errorHandler);

export default app;
