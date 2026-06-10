import { Router } from "express";
import { z } from "zod";
import { prisma } from "@rabovel/db";
import { authenticate } from "../middleware/auth";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { AppError } from "../utils/errors";
import { logAudit } from "../utils/audit";
import { getStock, MARKET_STOCKS } from "../data/stocks";

const router = Router();

const purchaseSchema = z.object({
  symbol: z.string().min(1),
  quantity: z.number().positive(),
});

router.use(authenticate, requireUser);

router.get("/market", (_req, res) => {
  res.json({ stocks: MARKET_STOCKS });
});

router.get("/holdings", async (req, res, next) => {
  try {
    const holdings = await prisma.holding.findMany({
      where: { userId: req.user!.userId },
      orderBy: { symbol: "asc" },
    });

    const enriched = holdings.map((h) => {
      const market = getStock(h.symbol);
      const currentPrice = market?.price ?? Number(h.currentPrice);
      const qty = Number(h.quantity);
      const value = qty * currentPrice;
      const cost = qty * Number(h.avgPrice);
      return {
        ...h,
        quantity: qty,
        avgPrice: Number(h.avgPrice),
        currentPrice,
        marketValue: value,
        gainLoss: value - cost,
        gainLossPct: cost > 0 ? ((value - cost) / cost) * 100 : 0,
      };
    });

    res.json({ holdings: enriched });
  } catch (err) {
    next(err);
  }
});

router.post("/purchase", validate(purchaseSchema), async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;
    const stock = getStock(symbol);
    if (!stock) throw new AppError(404, "Stock not found");

    const kyc = await prisma.kyc.findUnique({
      where: { userId: req.user!.userId },
    });
    if (kyc?.status !== "APPROVED") {
      throw new AppError(403, "KYC approval required before trading");
    }

    const totalCost = stock.price * quantity;

    const tradingWallet = await prisma.wallet.findUnique({
      where: {
        userId_type: { userId: req.user!.userId, type: "TRADING" },
      },
    });
    if (!tradingWallet) throw new AppError(404, "Trading wallet not found");
    if (Number(tradingWallet.balance) < totalCost) {
      throw new AppError(400, "Insufficient trading wallet balance");
    }

    const existing = await prisma.holding.findUnique({
      where: {
        userId_symbol: { userId: req.user!.userId, symbol: stock.symbol },
      },
    });

    const result = await prisma.$transaction(
      async (tx) => {
      await tx.wallet.update({
        where: { id: tradingWallet.id },
        data: { balance: { decrement: totalCost } },
      });

      const transaction = await tx.transaction.create({
        data: {
          userId: req.user!.userId,
          walletId: tradingWallet.id,
          type: "PURCHASE",
          amount: totalCost,
          status: "COMPLETED",
          description: `Purchased ${quantity} shares of ${stock.symbol}`,
          metadata: { symbol: stock.symbol, quantity, price: stock.price },
        },
      });

      let holding;
      if (existing) {
        const oldQty = Number(existing.quantity);
        const newQty = oldQty + quantity;
        const newAvg =
          (oldQty * Number(existing.avgPrice) + totalCost) / newQty;
        holding = await tx.holding.update({
          where: { id: existing.id },
          data: {
            quantity: newQty,
            avgPrice: newAvg,
            currentPrice: stock.price,
          },
        });
      } else {
        holding = await tx.holding.create({
          data: {
            userId: req.user!.userId,
            symbol: stock.symbol,
            name: stock.name,
            quantity,
            avgPrice: stock.price,
            currentPrice: stock.price,
          },
        });
      }

      return { holding, transaction };
    },
    { maxWait: 10_000, timeout: 30_000 }
    );

    await logAudit(
      "STOCK_PURCHASED",
      req.user!.userId,
      { symbol: stock.symbol, quantity, totalCost },
      req.ip
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
