import handler from "@rabovel/api/vercel";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
  maxDuration: 60,
};

export default handler;
