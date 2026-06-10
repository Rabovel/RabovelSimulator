import { config } from "../config";
import { AppError } from "../utils/errors";

const FLW_BASE = "https://api.flutterwave.com/v3";

interface FlutterwaveInitResponse {
  status: string;
  message: string;
  data: { link: string };
}

interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    status: string;
    amount: number;
    currency: string;
    tx_ref: string;
  };
}

async function flutterwaveRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!config.flutterwave.secretKey) {
    throw new AppError(503, "Flutterwave is not configured");
  }

  const res = await fetch(`${FLW_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.flutterwave.secretKey}`,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });

  const body = (await res.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
  };

  if (!res.ok || body.status !== "success") {
    throw new AppError(
      502,
      body.message ?? "Flutterwave request failed"
    );
  }

  return body as T;
}

export async function initializePayment(params: {
  txRef: string;
  amount: number;
  currency: string;
  email: string;
  name: string;
  redirectUrl: string;
  description: string;
}) {
  return flutterwaveRequest<FlutterwaveInitResponse>("/payments", {
    method: "POST",
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: {
        email: params.email,
        name: params.name,
      },
      customizations: {
        title: "Raboovel Earn",
        description: params.description,
        logo: "https://www.rabovel.com/images/logo/Rabovel.png",
      },
    }),
  });
}

export async function verifyPayment(txRef: string) {
  return flutterwaveRequest<FlutterwaveVerifyResponse>(
    `/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`
  );
}

export function verifyWebhookHash(headerHash: string | undefined): boolean {
  const secret = config.flutterwave.webhookSecret;
  if (!secret) return config.nodeEnv === "development";
  return headerHash === secret;
}
