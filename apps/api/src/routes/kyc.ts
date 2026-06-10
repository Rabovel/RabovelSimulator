import { Router } from "express";
import { z } from "zod";
import { prisma } from "@rabovel/db";
import { authenticate } from "../middleware/auth";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { AppError } from "../utils/errors";
import { logAudit } from "../utils/audit";

const router = Router();

const submitSchema = z.object({
  documentType: z.enum(["PASSPORT", "DRIVERS_LICENSE", "NATIONAL_ID"]),
  documentNumber: z.string().min(3),
  dateOfBirth: z.string().datetime(),
  address: z.string().min(5),
});

router.use(authenticate, requireUser);

router.get("/status", async (req, res, next) => {
  try {
    const kyc = await prisma.kyc.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!kyc) throw new AppError(404, "KYC record not found");
    res.json({ kyc });
  } catch (err) {
    next(err);
  }
});

router.post("/submit", validate(submitSchema), async (req, res, next) => {
  try {
    const kyc = await prisma.kyc.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!kyc) throw new AppError(404, "KYC record not found");
    if (kyc.status === "APPROVED") throw new AppError(400, "KYC already approved");
    if (kyc.status === "PENDING") throw new AppError(400, "KYC already pending review");

    const updated = await prisma.kyc.update({
      where: { userId: req.user!.userId },
      data: {
        ...req.body,
        dateOfBirth: new Date(req.body.dateOfBirth),
        status: "PENDING",
        submittedAt: new Date(),
        rejectionNote: null,
        verifiedAt: null,
      },
    });

    await logAudit("KYC_SUBMITTED", req.user!.userId, {}, req.ip);
    res.json({ kyc: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
