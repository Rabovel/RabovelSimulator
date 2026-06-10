"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./api";
import { queryKeys } from "./query-keys";
import { useAuthStore } from "@/stores/auth-store";

function useToken() {
  return useAuthStore((s) => s.token);
}

export function useSummary() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.summary,
    queryFn: () => api.summary(token!).then((r) => r.summary),
    enabled: !!token,
  });
}

export function useTransactions() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => api.transactions(token!).then((r) => r.transactions),
    enabled: !!token,
  });
}

export function useWallets() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.wallets,
    queryFn: () => api.wallets(token!).then((r) => r.wallets),
    enabled: !!token,
  });
}

export function useHoldings() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.holdings,
    queryFn: () => api.holdings(token!).then((r) => r.holdings),
    enabled: !!token,
  });
}

export function useMarket() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.market,
    queryFn: () => api.market(token!).then((r) => r.stocks),
    enabled: !!token,
  });
}

export function useStakes() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.stakes,
    queryFn: () => api.stakes(token!).then((r) => r.stakes),
    enabled: !!token,
  });
}

export function useRewards() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.rewards,
    queryFn: () => api.rewards(token!),
    enabled: !!token,
  });
}

export function useKycStatus() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.kyc,
    queryFn: () => api.kycStatus(token!).then((r) => r.kyc),
    enabled: !!token,
  });
}

export function useDepositStatus(reference: string | null) {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.depositStatus(reference ?? ""),
    queryFn: () => api.depositStatus(token!, reference!),
    enabled: !!token && !!reference,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (
        status === "COMPLETED" ||
        status === "FAILED" ||
        status === "CANCELLED"
      ) {
        return false;
      }
      return 3000;
    },
  });
}

export function useAdminUserMetrics() {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.adminUserMetrics,
    queryFn: () => api.adminUserMetrics(token!),
    enabled: !!token,
  });
}

export function useAdminKycList(status: string) {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.adminKycList(status),
    queryFn: () => api.adminKycList(token!, status).then((r) => r.submissions),
    enabled: !!token,
  });
}

export function usePurchase() {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { symbol: string; quantity: number }) =>
      api.purchase(token!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holdings });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
    },
  });
}

export function useCreateStake() {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { holdingId: string; amount: number }) =>
      api.createStake(token!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stakes });
      queryClient.invalidateQueries({ queryKey: queryKeys.holdings });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
    },
  });
}

export function useInitiateDeposit() {
  const token = useToken();
  return useMutation({
    mutationFn: (body: { amount: number; walletType?: string }) =>
      api.initiateDeposit(token!, body),
  });
}

export function useWithdraw() {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      amount: number;
      accountNumber: string;
      bankName: string;
      accountName: string;
    }) => api.withdraw(token!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary });
    },
  });
}

export function useSubmitKyc() {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      documentType: string;
      documentNumber: string;
      dateOfBirth: string;
      address: string;
    }) => api.submitKyc(token!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
  });
}

export function useAdminKycApprove() {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (kycId: string) => api.adminKycApprove(token!, kycId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUserMetrics });
    },
  });
}

export function useAdminKycReject() {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      kycId,
      rejectionNote,
    }: {
      kycId: string;
      rejectionNote: string;
    }) => api.adminKycReject(token!, kycId, rejectionNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUserMetrics });
    },
  });
}
