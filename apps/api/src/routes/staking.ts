import { Router } from "express";
import { z } from "zod";
import { prisma } from "@rabovel/db";
import { authenticate } from "../middleware/auth";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { AppError } from "../utils/errors";
import { logAudit } from "../utils/audit";
import {
  STAKING_APY,
  calculateAnnualStakingYield,
  getSharePrice,
} from "../services/stakingRewards";

const router = Router();

const createStakeSchema = z.object({
  holdingId: z.string(),
  amount: z.number().positive(),
});

router.use(authenticate, requireUser);

router.get("/", async (req, res, next) => {
  try {
    const stakes = await prisma.stake.findMany({
      where: { userId: req.user!.userId },
      include: {
        holding: { select: { symbol: true, name: true, currentPrice: true } },
        rewards: { select: { amount: true, distributedAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = stakes.map((s) => {
      const amount = Number(s.amount);
      const apy = Number(s.apy);
      const price = getSharePrice(s.holding.symbol, Number(s.holding.currentPrice ?? 0));
      return {
        ...s,
        amount,
        apy,
        estimatedAnnualYield: calculateAnnualStakingYield(amount, price, apy),
      };
    });

    res.json({ stakes: enriched });
  } catch (err) {
    next(err);
  }
});

router.post("/create", validate(createStakeSchema), async (req, res, next) => {
  try {
    const { holdingId, amount } = req.body;

    const kyc = await prisma.kyc.findUnique({
      where: { userId: req.user!.userId },
    });
    if (kyc?.status !== "APPROVED") {
      throw new AppError(403, "KYC approval required before staking");
    }

    const holding = await prisma.holding.findFirst({
      where: { id: holdingId, userId: req.user!.userId },
    });
    if (!holding) throw new AppError(404, "Holding not found");

    const available = Number(holding.quantity);
    const staked = await prisma.stake.aggregate({
      where: { holdingId, status: "ACTIVE" },
      _sum: { amount: true },
    });
    const stakedAmount = Number(staked._sum.amount ?? 0);
    if (amount > available - stakedAmount) {
      throw new AppError(400, "Insufficient unstaked shares");
    }

    const stake = await prisma.stake.create({
      data: {
        userId: req.user!.userId,
        holdingId,
        amount,
        apy: STAKING_APY,
        status: "ACTIVE",
      },
      include: { holding: { select: { symbol: true, name: true } } },
    });

    await logAudit(
      "STAKE_CREATED",
      req.user!.userId,
      { holdingId, amount, apy: STAKING_APY },
      req.ip
    );

    res.status(201).json({ stake });
  } catch (err) {
    next(err);
  }
});

export default router;
