import type { NextApiRequest, NextApiResponse } from "next";
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
