import { prisma } from "@rabovel/db";
import { AppError } from "../utils/errors";
import { logAudit } from "../utils/audit";

export async function completeDeposit(
  reference: string,
  options?: { verifiedAmount?: number; ipAddress?: string }
) {
  const transaction = await prisma.transaction.findUnique({
    where: { externalRef: reference },
    include: { wallet: true },
  });

  if (!transaction) {
    throw new AppError(404, "Deposit not found");
  }

  if (transaction.type !== "DEPOSIT") {
    throw new AppError(400, "Invalid transaction type");
  }

  if (transaction.status === "COMPLETED") {
    return { transaction, wallet: transaction.wallet, alreadyCompleted: true };
  }

  if (transaction.status !== "PENDING") {
    throw new AppError(400, `Deposit is ${transaction.status}`);
  }

  if (options?.verifiedAmount !== undefined) {
    const expected = Number(transaction.amount);
    if (Math.abs(expected - options.verifiedAmount) > 0.01) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "FAILED" },
      });
      throw new AppError(400, "Payment amount mismatch");
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.update({
      where: { id: transaction.walletId },
      data: { balance: { increment: transaction.amount } },
    });

    const updatedTx = await tx.transaction.update({
      where: { id: transaction.id },
      data: { status: "COMPLETED" },
    });

    await tx.notification.create({
      data: {
        userId: transaction.userId,
        title: "Deposit received",
        message: `₦${Number(transaction.amount).toLocaleString()} has been credited to your ${transaction.wallet.type.toLowerCase()} wallet.`,
      },
    });

    return { transaction: updatedTx, wallet };
  });

  await logAudit(
    "DEPOSIT_COMPLETED",
    transaction.userId,
    { reference, amount: Number(transaction.amount) },
    options?.ipAddress
  );

  return { ...result, alreadyCompleted: false };
}

export function generateDepositReference() {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `rabovel_${Date.now()}_${suffix}`;
}
