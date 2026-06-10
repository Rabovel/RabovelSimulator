import { Router } from "express";
import { prisma } from "@rabovel/db";
import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/metrics", async (_req, res, next) => {
  try {
    const [
      totalUsers,
      kycPending,
      kycApproved,
      kycRejected,
      kycNotStarted,
      totalTransactions,
      depositAgg,
      activeStakes,
      users,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.kyc.count({ where: { status: "PENDING" } }),
      prisma.kyc.count({ where: { status: "APPROVED" } }),
      prisma.kyc.count({ where: { status: "REJECTED" } }),
      prisma.kyc.count({ where: { status: "NOT_STARTED" } }),
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        where: { type: "DEPOSIT", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.stake.count({ where: { status: "ACTIVE" } }),
      prisma.user.findMany({
        where: { role: "USER" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          kyc: { select: { status: true, submittedAt: true } },
          wallets: { select: { type: true, balance: true, currency: true } },
          _count: {
            select: {
              holdings: true,
              stakes: true,
              transactions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const walletTotal = users.reduce(
      (sum, u) =>
        sum + u.wallets.reduce((s, w) => s + Number(w.balance), 0),
      0
    );

    const userMetrics = users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      createdAt: u.createdAt,
      kycStatus: u.kyc?.status ?? "NOT_STARTED",
      kycSubmittedAt: u.kyc?.submittedAt,
      walletBalance: u.wallets.reduce((s, w) => s + Number(w.balance), 0),
      holdingsCount: u._count.holdings,
      stakesCount: u._count.stakes,
      transactionsCount: u._count.transactions,
    }));

    res.json({
      summary: {
        totalUsers,
        kycPending,
        kycApproved,
        kycRejected,
        kycNotStarted,
        totalTransactions,
        totalDeposits: Number(depositAgg._sum.amount ?? 0),
        totalWalletBalance: walletTotal,
        activeStakes,
      },
      users: userMetrics,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
