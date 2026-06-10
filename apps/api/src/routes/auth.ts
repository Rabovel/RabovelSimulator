import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { z } from "zod";
import { prisma } from "@rabovel/db";
import { config } from "../config";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../utils/errors";
import { logAudit } from "../utils/audit";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  mfaToken: z.string().optional(),
});

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError(409, "Email already registered");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        kyc: { create: {} },
        wallets: {
          create: [
            { type: "PRIMARY", currency: "NGN" },
            { type: "TRADING", currency: "NGN" },
          ],
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        mfaEnabled: true,
        createdAt: true,
      },
    });

    const signOptions: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"] };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      signOptions
    );

    await logAudit("USER_REGISTERED", user.id, { email }, req.ip);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password, mfaToken } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(401, "Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, "Invalid credentials");

    if (user.mfaEnabled) {
      if (!mfaToken) throw new AppError(401, "MFA token required", "MFA_REQUIRED");
      const validMfa = authenticator.verify({
        token: mfaToken,
        secret: user.mfaSecret!,
      });
      if (!validMfa) throw new AppError(401, "Invalid MFA token");
    }

    const signOptions: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"] };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      signOptions
    );

    await logAudit("USER_LOGIN", user.id, {}, req.ip);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mfaEnabled: user.mfaEnabled,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        mfaEnabled: true,
        createdAt: true,
        kyc: { select: { status: true } },
      },
    });
    if (!user) throw new AppError(404, "User not found");
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/mfa/setup", authenticate, async (req, res, next) => {
  try {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      req.user!.email,
      "Raboovel Earn",
      secret
    );
    const qrCode = await QRCode.toDataURL(otpauth);

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { mfaSecret: secret },
    });

    res.json({ secret, qrCode });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/mfa/enable",
  authenticate,
  validate(z.object({ token: z.string().length(6) })),
  async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
      });
      if (!user?.mfaSecret) throw new AppError(400, "MFA not set up");

      const valid = authenticator.verify({
        token: req.body.token,
        secret: user.mfaSecret,
      });
      if (!valid) throw new AppError(400, "Invalid MFA token");

      await prisma.user.update({
        where: { id: user.id },
        data: { mfaEnabled: true },
      });

      await logAudit("MFA_ENABLED", user.id, {}, req.ip);
      res.json({ message: "MFA enabled successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
