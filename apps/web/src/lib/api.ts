function resolveApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:4000";
}

const API_URL = resolveApiUrl();

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.error ?? "Request failed",
      data.code,
      data.details
    );
  }
  return data as T;
}

export const api = {
  register: (body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => request<{ user: User; token: string }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string; mfaToken?: string }) =>
    request<{ user: User; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: (token: string) =>
    request<{ user: User & { kyc?: { status: string } } }>("/api/auth/me", {}, token),

  mfaSetup: (token: string) =>
    request<{ secret: string; qrCode: string }>(
      "/api/auth/mfa/setup",
      { method: "POST" },
      token
    ),

  mfaEnable: (token: string, body: { token: string }) =>
    request<{ message: string }>(
      "/api/auth/mfa/enable",
      { method: "POST", body: JSON.stringify(body) },
      token
    ),

  mfaDisable: (token: string, body: { password: string; token: string }) =>
    request<{ message: string }>(
      "/api/auth/mfa/disable",
      { method: "POST", body: JSON.stringify(body) },
      token
    ),

  kycStatus: (token: string) =>
    request<{ kyc: Kyc }>("/api/kyc/status", {}, token),

  submitKyc: (token: string, body: KycSubmit) =>
    request<{ kyc: Kyc }>("/api/kyc/submit", { method: "POST", body: JSON.stringify(body) }, token),

  wallets: (token: string) =>
    request<{ wallets: Wallet[] }>("/api/wallet", {}, token),

  withdraw: (
    token: string,
    body: {
      amount: number;
      accountNumber: string;
      bankName: string;
      accountName: string;
    }
  ) =>
    request<{
      transaction: Transaction;
      wallet: Wallet;
      message: string;
    }>("/api/wallet/withdraw", { method: "POST", body: JSON.stringify(body) }, token),

  initiateDeposit: (token: string, body: { amount: number; walletType?: string }) =>
    request<{
      transaction: Transaction;
      reference: string;
      paymentUrl: string;
      publicKey: string;
    }>("/api/wallet/deposit/initiate", { method: "POST", body: JSON.stringify(body) }, token),

  depositStatus: (token: string, reference: string) =>
    request<{
      status: string;
      transaction: Transaction;
      wallet?: Wallet;
    }>(`/api/wallet/deposit/${reference}/status`, {}, token),

  transactions: (token: string) =>
    request<{ transactions: Transaction[] }>("/api/wallet/transactions", {}, token),

  market: (token: string) =>
    request<{ stocks: Stock[] }>("/api/portfolio/market", {}, token),

  holdings: (token: string) =>
    request<{ holdings: Holding[] }>("/api/portfolio/holdings", {}, token),

  purchase: (token: string, body: { symbol: string; quantity: number }) =>
    request<{ holding: Holding; transaction: Transaction }>("/api/portfolio/purchase", { method: "POST", body: JSON.stringify(body) }, token),

  stakes: (token: string) =>
    request<{ stakes: Stake[] }>("/api/staking", {}, token),

  createStake: (token: string, body: { holdingId: string; amount: number }) =>
    request<{ stake: Stake }>("/api/staking/create", { method: "POST", body: JSON.stringify(body) }, token),

  rewards: (token: string) =>
    request<{ rewards: Reward[]; totalEarned: number }>("/api/rewards", {}, token),

  summary: (token: string) =>
    request<{ summary: AnalyticsSummary }>("/api/analytics/summary", {}, token),

  adminKycList: (token: string, status = "PENDING") =>
    request<{ submissions: AdminKycSubmission[] }>(
      `/api/admin/kyc?status=${status}`,
      {},
      token
    ),

  adminKycApprove: (token: string, kycId: string) =>
    request<{ kyc: AdminKycSubmission }>(
      `/api/admin/kyc/${kycId}/approve`,
      { method: "PATCH" },
      token
    ),

  adminKycReject: (token: string, kycId: string, rejectionNote: string) =>
    request<{ kyc: AdminKycSubmission }>(
      `/api/admin/kyc/${kycId}/reject`,
      { method: "PATCH", body: JSON.stringify({ rejectionNote }) },
      token
    ),

  adminUserMetrics: (token: string) =>
    request<AdminUserMetrics>("/api/admin/users/metrics", {}, token),
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  mfaEnabled: boolean;
}

export interface Kyc {
  id: string;
  status: string;
  documentType?: string;
  documentNumber?: string;
  dateOfBirth?: string;
  address?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionNote?: string;
}

export interface AdminUserMetrics {
  summary: {
    totalUsers: number;
    kycPending: number;
    kycApproved: number;
    kycRejected: number;
    kycNotStarted: number;
    totalTransactions: number;
    totalDeposits: number;
    totalWalletBalance: number;
    activeStakes: number;
  };
  users: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    kycStatus: string;
    kycSubmittedAt?: string;
    walletBalance: number;
    holdingsCount: number;
    stakesCount: number;
    transactionsCount: number;
  }[];
}

export interface AdminKycSubmission extends Kyc {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
}

export interface KycSubmit {
  documentType: string;
  documentNumber: string;
  dateOfBirth: string;
  address: string;
}

export interface Wallet {
  id: string;
  balance: number | string;
  currency: string;
  type: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  exchange?: string;
  sector?: string;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue?: number;
  gainLoss?: number;
  gainLossPct?: number;
}

export interface Stake {
  id: string;
  amount: number;
  apy: number;
  status: string;
  startDate: string;
  estimatedAnnualYield?: number;
  holding: { symbol: string; name: string };
}

export interface Reward {
  id: string;
  amount: number;
  type: string;
  description?: string;
  distributedAt: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number | string;
  status: string;
  externalRef?: string;
  description?: string;
  createdAt: string;
  wallet?: { type: string; currency: string };
}

export interface AnalyticsSummary {
  walletBalance: number;
  portfolioValue: number;
  totalValue: number;
  totalStaked: number;
  totalRewards: number;
  holdingsCount: number;
  activeStakes: number;
  transactionCount: number;
}
