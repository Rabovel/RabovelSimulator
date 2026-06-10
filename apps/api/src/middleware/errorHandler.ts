import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@rabovel/db";
import { AppError } from "../utils/errors";

function isPrismaInitError(err: Error): boolean {
  return (
    err.name === "PrismaClientInitializationError" ||
    err.constructor.name === "PrismaClientInitializationError"
  );
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.flatten().fieldErrors,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (["P1001", "P1002", "P1017", "P2028"].includes(err.code)) {
      return res.status(503).json({
        error:
          err.code === "P2028"
            ? "Database busy. Please try again in a moment."
            : "Database temporarily unavailable. Please try again.",
        code: err.code,
      });
    }
  }

  if (isPrismaInitError(err)) {
    return res.status(503).json({
      error: "Database connection failed. Please try again.",
      code: "DB_UNAVAILABLE",
    });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}
