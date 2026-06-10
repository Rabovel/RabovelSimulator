import { Router } from "express";
import { prisma } from "@rabovel/db";
import { authenticate } from "../middleware/auth";
import { requireUser } from "../middleware/requireUser";

const router = Router();

router.use(authenticate, requireUser);

router.get("/", async (req, res, next) => {
  try {
    const rewards = await prisma.reward.findMany({
      where: { userId: req.user!.userId },
      include: { stake: { select: { holding: { select: { symbol: true } } } } },
      orderBy: { distributedAt: "desc" },
    });

    const total = rewards.reduce((sum, r) => sum + Number(r.amount), 0);

    res.json({
      rewards: rewards.map((r) => ({ ...r, amount: Number(r.amount) })),
      totalEarned: total,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
