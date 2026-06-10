import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { distributeStakingRewards } from "../../services/stakingRewards";

const router = Router();

router.use(authenticate, requireAdmin);

router.post("/distribute-staking-rewards", async (req, res, next) => {
  try {
    const result = await distributeStakingRewards({
      triggeredBy: req.user!.userId,
      ipAddress: req.ip,
    });
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
