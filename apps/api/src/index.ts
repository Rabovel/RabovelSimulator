import { config, isFlutterwaveConfigured } from "./config";
import app from "./app";
import { wakeDatabase, startDatabaseKeepalive } from "@rabovel/db";
import { startStakingRewardsJob } from "./jobs/stakingRewardsJob";

async function checkDatabase() {
  const ready = await wakeDatabase();
  if (ready) {
    console.log("Database connected");
    startDatabaseKeepalive();
  } else {
    console.warn(
      "Database not ready on startup — Neon may be waking up. Requests will retry automatically."
    );
  }
}

async function start() {
  await checkDatabase();

  if (!isFlutterwaveConfigured()) {
    console.warn("Flutterwave keys missing — deposits will be unavailable");
  } else {
    console.log("Flutterwave configured");
  }

  app.listen(config.port, () => {
    console.log(`Raboovel API running on http://localhost:${config.port}`);
    startStakingRewardsJob();
  });
}

start();
