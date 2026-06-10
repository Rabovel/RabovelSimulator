import { Router } from "express";
import { prisma } from "@rabovel/db";
import { verifyWebhookHash } from "../services/flutterwave";
import { completeDeposit } from "../services/deposit";

const router = Router();

router.post("/flutterwave", async (req, res) => {
  const hash = req.headers["verif-hash"] as string | undefined;

  if (!verifyWebhookHash(hash)) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  const { event, data } = req.body;

  if (event !== "charge.completed" || !data?.tx_ref) {
    return res.sendStatus(200);
  }

  const reference = data.tx_ref as string;
  const status = data.status as string;
  const amount = Number(data.amount);

  try {
    if (status === "successful") {
      await completeDeposit(reference, { verifiedAmount: amount });
    } else if (status === "failed" || status === "cancelled") {
      await prisma.transaction.updateMany({
        where: { externalRef: reference, status: "PENDING" },
        data: { status: "FAILED" },
      });
    }
  } catch (err) {
    console.error("Flutterwave webhook error:", err);
  }

  return res.sendStatus(200);
});

export default router;
