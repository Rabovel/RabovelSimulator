import { Router } from "express";
import { distributeStakingRewards } from "../services/stakingRewards";

const router = Router();

router.get("/staking-rewards", async (req, res, next) => {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (!cronSecret) {
      return res.status(503).json({ error: "CRON_SECRET not configured" });
    }

    const auth = req.headers.authorization ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
    if (token !== cronSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await distributeStakingRewards({ triggeredBy: "cron" });
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
