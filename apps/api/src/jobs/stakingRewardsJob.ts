import { config } from "../config";
import { distributeStakingRewards } from "../services/stakingRewards";

let timer: ReturnType<typeof setInterval> | null = null;
let running = false;

async function runJob() {
  if (running) {
    console.warn("[staking-rewards] Job already running, skipping");
    return;
  }

  running = true;
  try {
    const result = await distributeStakingRewards();
    if (result.distributed > 0) {
      console.log(
        `[staking-rewards] Distributed ₦${result.totalAmount.toLocaleString("en-NG")} to ${result.distributed} stake(s)`
      );
    }
    if (result.errors > 0) {
      console.warn(`[staking-rewards] ${result.errors} stake(s) failed`);
    }
  } catch (err) {
    console.error("[staking-rewards] Job failed:", err);
  } finally {
    running = false;
  }
}

export function startStakingRewardsJob() {
  if (!config.stakingRewards.enabled) {
    console.log("[staking-rewards] Job disabled");
    return;
  }

  const hours = config.stakingRewards.intervalHours;
  const intervalMs = hours * 60 * 60 * 1000;

  console.log(
    `[staking-rewards] Scheduled every ${hours} hour(s) (${intervalMs}ms)`
  );

  timer = setInterval(runJob, intervalMs);

  if (config.stakingRewards.runOnStart) {
    setTimeout(runJob, 10_000);
  }
}

export function stopStakingRewardsJob() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export async function runStakingRewardsJobNow() {
  await runJob();
}
