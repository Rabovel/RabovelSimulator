export const queryKeys = {
  me: ["me"] as const,
  summary: ["summary"] as const,
  transactions: ["transactions"] as const,
  wallets: ["wallets"] as const,
  holdings: ["holdings"] as const,
  market: ["market"] as const,
  stakes: ["stakes"] as const,
  rewards: ["rewards"] as const,
  kyc: ["kyc"] as const,
  depositStatus: (reference: string) => ["deposit-status", reference] as const,
  adminUserMetrics: ["admin", "user-metrics"] as const,
  adminKycList: (status: string) => ["admin", "kyc", status] as const,
};
