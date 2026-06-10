import { Router } from "express";
import { prisma } from "@rabovel/db";
import { authenticate } from "../middleware/auth";
import { requireUser } from "../middleware/requireUser";
import { getStock } from "../data/stocks";

const router = Router();

router.use(authenticate, requireUser);

router.get("/summary", async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const [wallets, holdings, stakes, rewards, transactions] =
      await Promise.all([
        prisma.wallet.findMany({ where: { userId } }),
        prisma.holding.findMany({ where: { userId } }),
        prisma.stake.findMany({
          where: { userId, status: "ACTIVE" },
        }),
        prisma.reward.findMany({ where: { userId } }),
        prisma.transaction.count({ where: { userId } }),
      ]);

    const walletBalance = wallets.reduce(
      (sum, w) => sum + Number(w.balance),
      0
    );

    const portfolioValue = holdings.reduce((sum, h) => {
      const market = getStock(h.symbol);
      const price = market?.price ?? Number(h.currentPrice);
      return sum + Number(h.quantity) * price;
    }, 0);

    const totalStaked = stakes.reduce((sum, s) => sum + Number(s.amount), 0);
    const totalRewards = rewards.reduce((sum, r) => sum + Number(r.amount), 0);

    res.json({
      summary: {
        walletBalance,
        portfolioValue,
        totalValue: walletBalance + portfolioValue,
        totalStaked,
        totalRewards,
        holdingsCount: holdings.length,
        activeStakes: stakes.length,
        transactionCount: transactions,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
