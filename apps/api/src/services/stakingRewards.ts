import { prisma } from "@rabovel/db";
import { getStock } from "../data/stocks";
import { logAudit } from "../utils/audit";

export const STAKING_APY = 8.5;
const DAYS_PER_YEAR = 365;
const MIN_REWARD_NGN = 0.01;

export function startOfUtcDay(date = new Date()) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function calculateDailyStakingReward(
  stakedShares: number,
  pricePerShare: number,
  apy: number
) {
  const stakedValue = stakedShares * pricePerShare;
  const daily = (stakedValue * (apy / 100)) / DAYS_PER_YEAR;
  return Math.round(daily * 100) / 100;
}

export function calculateAnnualStakingYield(
  stakedShares: number,
  pricePerShare: number,
  apy: number
) {
  const stakedValue = stakedShares * pricePerShare;
  return Math.round(stakedValue * (apy / 100) * 100) / 100;
}

export function getSharePrice(symbol: string, fallbackPrice: number) {
  const market = getStock(symbol);
  return market?.price ?? fallbackPrice;
}

export interface DistributeStakingRewardsResult {
  distributed: number;
  skipped: number;
  totalAmount: number;
  errors: number;
}

export async function distributeStakingRewards(options?: {
  triggeredBy?: string;
  ipAddress?: string;
}): Promise<DistributeStakingRewardsResult> {
  const periodStart = startOfUtcDay();
  const stakes = await prisma.stake.findMany({
    where: { status: "ACTIVE" },
    include: {
      holding: { select: { symbol: true, name: true, currentPrice: true } },
      rewards: {
        where: {
          type: "STAKING_YIELD",
          distributedAt: { gte: periodStart },
        },
        select: { id: true },
      },
    },
  });

  let distributed = 0;
  let skipped = 0;
  let totalAmount = 0;
  let errors = 0;

  for (const stake of stakes) {
    if (stake.rewards.length > 0) {
      skipped++;
      continue;
    }

    const stakedShares = Number(stake.amount);
    const apy = Number(stake.apy);
    const price = getSharePrice(
      stake.holding.symbol,
      Number(stake.holding.currentPrice)
    );
    const rewardAmount = calculateDailyStakingReward(stakedShares, price, apy);

    if (rewardAmount < MIN_REWARD_NGN) {
      skipped++;
      continue;
    }

    const primaryWallet = await prisma.wallet.findUnique({
      where: {
        userId_type: { userId: stake.userId, type: "PRIMARY" },
      },
    });

    if (!primaryWallet) {
      errors++;
      console.error(
        `[staking-rewards] No PRIMARY wallet for user ${stake.userId}`
      );
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { id: primaryWallet.id },
          data: { balance: { increment: rewardAmount } },
        });

        await tx.transaction.create({
          data: {
            userId: stake.userId,
            walletId: primaryWallet.id,
            type: "REWARD",
            amount: rewardAmount,
            status: "COMPLETED",
            description: `Staking yield — ${stake.holding.symbol}`,
            metadata: {
              stakeId: stake.id,
              symbol: stake.holding.symbol,
              stakedShares,
              apy,
              pricePerShare: price,
              periodStart: periodStart.toISOString(),
            },
          },
        });

        await tx.reward.create({
          data: {
            userId: stake.userId,
            stakeId: stake.id,
            amount: rewardAmount,
            type: "STAKING_YIELD",
            description: `Daily yield on ${stakedShares} ${stake.holding.symbol} shares at ${apy}% APY`,
          },
        });

        await tx.notification.create({
          data: {
            userId: stake.userId,
            title: "Staking reward received",
            message: `You earned ₦${rewardAmount.toLocaleString("en-NG")} from staking ${stake.holding.symbol}.`,
          },
        });
      });

      distributed++;
      totalAmount += rewardAmount;
    } catch (err) {
      errors++;
      console.error(`[staking-rewards] Failed for stake ${stake.id}:`, err);
    }
  }

  if (distributed > 0 || options?.triggeredBy) {
    await logAudit(
      "STAKING_REWARDS_DISTRIBUTED",
      options?.triggeredBy,
      { distributed, skipped, totalAmount, errors, periodStart },
      options?.ipAddress
    );
  }

  return { distributed, skipped, totalAmount, errors };
}
