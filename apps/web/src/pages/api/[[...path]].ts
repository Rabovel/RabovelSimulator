import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

// Load API env before the Express handler (Next.js cwd is apps/web)
const apiEnvCandidates = [
  path.resolve(process.cwd(), "../api/.env"),
  path.resolve(process.cwd(), "apps/api/.env"),
  path.resolve(process.cwd(), "../../apps/api/.env"),
];
for (const envPath of apiEnvCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

import handler from "@rabovel/api/vercel";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
