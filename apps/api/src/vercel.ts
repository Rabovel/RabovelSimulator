import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Request, Response } from "express";
import "./config";
import app from "./app";
import { wakeDatabase } from "@rabovel/db";

let dbReady = false;
let waking: Promise<boolean> | null = null;

async function ensureReady() {
  if (dbReady) return;
  if (!waking) {
    waking = wakeDatabase().then((ok) => {
      dbReady = ok;
      waking = null;
      return ok;
    });
  }
  await waking;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureReady();
  return new Promise<void>((resolve, reject) => {
    res.on("finish", () => resolve());
    res.on("error", reject);
    app(req as unknown as Request, res as unknown as Response);
  });
}
