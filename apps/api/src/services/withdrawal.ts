import { prisma } from "@rabovel/db";
import { AppError } from "../utils/errors";
import { logAudit } from "../utils/audit";

export function generateWithdrawalReference() {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `rabovel_wd_${Date.now()}_${suffix}`;
}

export async function processWithdrawal(params: {
  userId: string;
  amount: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
  ipAddress?: string;
}) {
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId_type: { userId: params.userId, type: "PRIMARY" },
    },
  });

  if (!wallet) throw new AppError(404, "Primary wallet not found");

  const balance = Number(wallet.balance);
  if (balance < params.amount) {
    throw new AppError(400, "Insufficient primary wallet balance");
  }

  const reference = generateWithdrawalReference();

  // Batch transaction — compatible with Neon PgBouncer (avoids P2028 interactive tx errors)
  const [updatedWallet, transaction] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: params.amount } },
    }),
    prisma.transaction.create({
      data: {
        userId: params.userId,
        walletId: wallet.id,
        type: "WITHDRAWAL",
        amount: params.amount,
        status: "COMPLETED",
        externalRef: reference,
        description: `Withdrawal to ${params.bankName}`,
        metadata: {
          accountNumber: params.accountNumber,
          bankName: params.bankName,
          accountName: params.accountName,
        },
      },
    }),
    prisma.notification.create({
      data: {
        userId: params.userId,
        title: "Withdrawal processed",
        message: `₦${params.amount.toLocaleString()} has been sent to your ${params.bankName} account ending ${params.accountNumber.slice(-4)}.`,
      },
    }),
  ]);

  const result = { transaction, wallet: updatedWallet };

  await logAudit(
    "WITHDRAWAL_COMPLETED",
    params.userId,
    {
      reference,
      amount: params.amount,
      bankName: params.bankName,
      accountNumber: params.accountNumber.slice(-4),
    },
    params.ipAddress
  );

  return result;
}
