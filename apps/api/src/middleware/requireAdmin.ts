import { Request, Response, NextFunction } from "express";
import { prisma } from "@rabovel/db";
import { AppError } from "../utils/errors";

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return next(new AppError(403, "Admin access required"));
    }

    next();
  } catch (err) {
    next(err);
  }
}
