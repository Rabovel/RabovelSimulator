import { prisma, Prisma } from "@rabovel/db";

export async function logAudit(
  action: string,
  userId?: string,
  metadata?: Record<string, unknown>,
  ipAddress?: string
) {
  await prisma.auditLog.create({
    data: {
      action,
      userId,
      metadata: metadata as Prisma.InputJsonValue | undefined,
      ipAddress,
    },
  });
}
