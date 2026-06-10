import { Router } from "express";
import { z } from "zod";
import { prisma } from "@rabovel/db";
import { authenticate } from "../middleware/auth";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { AppError } from "../utils/errors";
import { logAudit } from "../utils/audit";
import { config, isFlutterwaveConfigured } from "../config";
import { initializePayment, verifyPayment } from "../services/flutterwave";
import { completeDeposit, generateDepositReference } from "../services/deposit";

const router = Router();

const depositSchema = z.object({
  amount: z.number().positive().min(100).max(10_000_000),
  walletType: z.enum(["PRIMARY", "TRADING"]).default("PRIMARY"),
});

router.use(authenticate, requireUser);

router.get("/", async (req, res, next) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.user!.userId },
      orderBy: { type: "asc" },
    });
    res.json({ wallets });
  } catch (err) {
    next(err);
  }
});

router.post("/deposit/initiate", validate(depositSchema), async (req, res, next) => {
  try {
    if (!isFlutterwaveConfigured()) {
      throw new AppError(
        503,
        "Flutterwave is not configured. Set FLUTTERWAVE_SECRET_KEY in apps/api/.env"
      );
    }

    const { amount, walletType } = req.body;

    const kyc = await prisma.kyc.findUnique({
      where: { userId: req.user!.userId },
    });
    if (kyc?.status !== "APPROVED") {
      throw new AppError(403, "KYC approval required before funding");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });
    if (!user) throw new AppError(404, "User not found");

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId_type: { userId: req.user!.userId, type: walletType },
      },
    });
    if (!wallet) throw new AppError(404, "Wallet not found");

    const reference = generateDepositReference();

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user!.userId,
        walletId: wallet.id,
        type: "DEPOSIT",
        amount,
        status: "PENDING",
        externalRef: reference,
        description: `Flutterwave deposit to ${walletType} wallet`,
        metadata: {
          provider: "flutterwave",
          walletType,
        },
      },
    });

    const redirectUrl = `${config.corsOrigin}/wallet?deposit=${reference}`;
    const payment = await initializePayment({
      txRef: reference,
      amount,
      currency: wallet.currency,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      redirectUrl,
      description: `${walletType} wallet deposit`,
    });

    await logAudit(
      "DEPOSIT_INITIATED",
      req.user!.userId,
      { amount, walletType, reference },
      req.ip
    );

    res.status(201).json({
      transaction,
      reference,
      paymentUrl: payment.data.link,
      publicKey: config.flutterwave.publicKey,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/deposit/:reference/status", async (req, res, next) => {
  try {
    const { reference } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        externalRef: reference,
        userId: req.user!.userId,
        type: "DEPOSIT",
      },
      include: { wallet: { select: { type: true, currency: true, balance: true } } },
    });

    if (!transaction) {
      throw new AppError(404, "Deposit not found");
    }

    if (transaction.status === "PENDING" && isFlutterwaveConfigured()) {
      try {
        const verified = await verifyPayment(reference);
        if (verified.data.status === "successful") {
          const result = await completeDeposit(reference, {
            verifiedAmount: verified.data.amount,
            ipAddress: req.ip,
          });
          return res.json({
            status: "COMPLETED",
            transaction: result.transaction,
            wallet: result.wallet,
          });
        }
        if (
          verified.data.status === "failed" ||
          verified.data.status === "cancelled"
        ) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: "FAILED" },
          });
          return res.json({ status: "FAILED", transaction });
        }
      } catch {
        // Verification pending — return current status for polling
      }
    }

    res.json({
      status: transaction.status,
      transaction,
      wallet: transaction.wallet,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/transactions", async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.userId },
      include: { wallet: { select: { type: true, currency: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ transactions });
  } catch (err) {
    next(err);
  }
});

export default router;
