import { Router } from "express";
import { prisma } from "@rabovel/db";
import { authenticate } from "../middleware/auth";
import { requireUser } from "../middleware/requireUser";

const router = Router();

router.use(authenticate, requireUser);

router.get("/", async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { read: true },
    });
    if (notification.count === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
});

export default router;
