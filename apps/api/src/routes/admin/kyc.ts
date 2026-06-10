import { Router } from "express";
import { z } from "zod";
import { prisma } from "@rabovel/db";
import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { validate } from "../../middleware/validate";
import { AppError } from "../../utils/errors";
import { logAudit } from "../../utils/audit";

const router = Router();

function paramId(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

router.use(authenticate, requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const status = (req.query.status as string) || "PENDING";
    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "NOT_STARTED", "ALL"];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, "Invalid status filter");
    }

    const submissions = await prisma.kyc.findMany({
      where:
        status === "ALL"
          ? { status: { not: "NOT_STARTED" } }
          : { status: status as "PENDING" | "APPROVED" | "REJECTED" | "NOT_STARTED" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({ submissions });
  } catch (err) {
    next(err);
  }
});

router.patch("/:kycId/approve", async (req, res, next) => {
  try {
    const kycId = paramId(req.params.kycId);
    const kyc = await prisma.kyc.findUnique({
      where: { id: kycId },
      include: { user: { select: { id: true, email: true, firstName: true } } },
    });

    if (!kyc) throw new AppError(404, "KYC submission not found");
    if (kyc.status === "APPROVED") throw new AppError(400, "Already approved");
    if (kyc.status !== "PENDING") {
      throw new AppError(400, `Cannot approve submission with status ${kyc.status}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const record = await tx.kyc.update({
        where: { id: kyc.id },
        data: {
          status: "APPROVED",
          verifiedAt: new Date(),
          rejectionNote: null,
        },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      });

      await tx.notification.create({
        data: {
          userId: kyc.userId,
          title: "KYC approved",
          message:
            "Your identity verification has been approved. You can now fund your wallet and trade.",
        },
      });

      return record;
    });

    await logAudit(
      "KYC_APPROVED",
      req.user!.userId,
      { kycId: kyc.id, targetUserId: kyc.userId },
      req.ip
    );

    res.json({ kyc: updated });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/:kycId/reject",
  validate(z.object({ rejectionNote: z.string().min(5).max(500) })),
  async (req, res, next) => {
    try {
      const kycId = paramId(req.params.kycId);
      const kyc = await prisma.kyc.findUnique({
        where: { id: kycId },
      });

      if (!kyc) throw new AppError(404, "KYC submission not found");
      if (kyc.status === "REJECTED") throw new AppError(400, "Already rejected");
      if (kyc.status !== "PENDING") {
        throw new AppError(400, `Cannot reject submission with status ${kyc.status}`);
      }

      const updated = await prisma.$transaction(async (tx) => {
        const record = await tx.kyc.update({
          where: { id: kyc.id },
          data: {
            status: "REJECTED",
            rejectionNote: req.body.rejectionNote,
            verifiedAt: null,
          },
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true },
            },
          },
        });

        await tx.notification.create({
          data: {
            userId: kyc.userId,
            title: "KYC requires attention",
            message: `Your verification was not approved: ${req.body.rejectionNote}. Please resubmit with correct details.`,
          },
        });

        return record;
      });

      await logAudit(
        "KYC_REJECTED",
        req.user!.userId,
        { kycId: kyc.id, targetUserId: kyc.userId, reason: req.body.rejectionNote },
        req.ip
      );

      res.json({ kyc: updated });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
