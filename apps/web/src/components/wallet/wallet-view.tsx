"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Wallet,
  LineChart,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Layers,
  Shield,
  History,
  Sparkles,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Input, Badge, Spinner } from "@/components/ui";
import { AlertBanner } from "@/components/auth/alert-banner";
import {
  useWallets,
  useTransactions,
  useInitiateDeposit,
  useDepositStatus,
} from "@/lib/queries";
import { queryKeys } from "@/lib/query-keys";
import { formatCurrency } from "@/lib/utils";
import { ApiError, type Transaction } from "@/lib/api";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [500, 1000, 5000, 10000, 50000];

const WALLET_OPTIONS = [
  {
    value: "PRIMARY",
    label: "Primary",
    description: "Deposits, rewards & withdrawals",
    icon: Wallet,
  },
  {
    value: "TRADING",
    label: "Trading",
    description: "Buy NGX-listed stocks",
    icon: LineChart,
  },
] as const;

const TX_FILTERS = ["ALL", "DEPOSIT", "PURCHASE", "REWARD"] as const;

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "danger"> = {
    COMPLETED: "success",
    PENDING: "warning",
    FAILED: "danger",
    CANCELLED: "danger",
  };
  return map[status] ?? "default";
}

function txIcon(type: string) {
  const icons: Record<string, typeof ArrowDownLeft> = {
    DEPOSIT: ArrowDownLeft,
    WITHDRAWAL: ArrowUpRight,
    PURCHASE: LineChart,
    SALE: ArrowUpRight,
    REWARD: Gift,
    STAKE: Layers,
    UNSTAKE: Layers,
  };
  return icons[type] ?? History;
}

function txIconStyle(type: string) {
  if (type === "DEPOSIT" || type === "REWARD") return "bg-accent/15 text-accent";
  if (type === "PURCHASE" || type === "SALE") return "bg-primary/15 text-primary";
  return "bg-surface-hover text-muted";
}

function formatTxDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) {
    return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffHours < 48) return "Yesterday";
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function WalletBalanceHero({
  total,
  wallets,
  loading,
}: {
  total: number;
  wallets: { type: string; balance: number | string; currency: string }[];
  loading: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-dark text-white p-6 sm:p-8 mb-8">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 100% 0%, #4a6cf7 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 0% 100%, #34d399 0%, transparent 45%)",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
          <Sparkles className="w-4 h-4" />
          Total wallet balance
        </div>
        {loading ? (
          <div className="h-10 w-48 bg-white/10 rounded-lg animate-pulse" />
        ) : (
          <p className="text-3xl sm:text-4xl font-bold tracking-tight">
            {formatCurrency(total)}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/10">
          {wallets.map((w) => (
            <div key={w.type} className="min-w-[120px]">
              <p className="text-xs text-white/50 uppercase tracking-wide">
                {w.type}
              </p>
              <p className="text-lg font-semibold mt-0.5">
                {loading ? "—" : formatCurrency(Number(w.balance))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DepositStatusBanner({
  status,
}: {
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
}) {
  const isPending = status === "PENDING";
  const isSuccess = status === "COMPLETED";
  const isFailed = status === "FAILED" || status === "CANCELLED";

  return (
    <div
      className={cn(
        "mb-8 rounded-2xl border p-5 sm:p-6 animate-fade-in",
        isPending && "border-primary/25 bg-primary/5",
        isSuccess && "border-accent/25 bg-accent/5",
        isFailed && "border-danger/25 bg-danger/5"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            isPending && "bg-primary/15 text-primary",
            isSuccess && "bg-accent/15 text-accent",
            isFailed && "bg-danger/15 text-danger"
          )}
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="font-semibold text-lg">
            {isSuccess
              ? "Payment confirmed"
              : isFailed
                ? "Payment unsuccessful"
                : "Confirming payment"}
          </p>
          <p className="text-sm text-muted mt-1">
            {isPending
              ? "We're waiting for Flutterwave to confirm your deposit. This usually takes a few seconds."
              : isSuccess
                ? "Your wallet balance has been updated."
                : "The payment was cancelled or failed. You can try again below."}
          </p>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const Icon = txIcon(tx.type);
  const isCredit = tx.type === "DEPOSIT" || tx.type === "REWARD" || tx.type === "SALE";

  return (
    <div className="flex items-center gap-4 py-4 group">
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
          txIconStyle(tx.type)
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {tx.description ?? tx.type.replace("_", " ")}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {tx.wallet?.type ?? "Wallet"} · {formatTxDate(tx.createdAt)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={cn(
            "font-semibold text-sm tabular-nums",
            isCredit ? "text-accent" : "text-foreground"
          )}
        >
          {isCredit ? "+" : "−"}
          {formatCurrency(Number(tx.amount))}
        </p>
        <div className="mt-1">
          <Badge variant={statusBadge(tx.status)}>{tx.status}</Badge>
        </div>
      </div>
    </div>
  );
}

export function WalletView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const depositRef = searchParams.get("deposit");

  const { data: wallets = [], isLoading: walletsLoading } = useWallets();
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const { data: depositResult } = useDepositStatus(depositRef);
  const initiateDeposit = useInitiateDeposit();

  const [amount, setAmount] = useState("");
  const [walletType, setWalletType] = useState<string>("PRIMARY");
  const [txFilter, setTxFilter] = useState<(typeof TX_FILTERS)[number]>("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pollStatus = depositResult?.status ?? null;
  const polling = !!depositRef && pollStatus === "PENDING";

  const totalBalance = useMemo(
    () => wallets.reduce((sum, w) => sum + Number(w.balance), 0),
    [wallets]
  );

  const filteredTx = useMemo(() => {
    if (txFilter === "ALL") return transactions;
    return transactions.filter((tx) => tx.type === txFilter);
  }, [transactions, txFilter]);

  useEffect(() => {
    if (pollStatus === "COMPLETED") {
      setSuccess("Deposit received! Your wallet has been credited.");
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      router.replace("/wallet");
    } else if (pollStatus === "FAILED" || pollStatus === "CANCELLED") {
      setError("Payment was not completed. Please try again.");
      router.replace("/wallet");
    }
  }, [pollStatus, queryClient, router]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const { paymentUrl } = await initiateDeposit.mutateAsync({
        amount: parseFloat(amount),
        walletType,
      });
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start payment");
    }
  };

  const isBusy = initiateDeposit.isPending || polling;
  const parsedAmount = parseFloat(amount) || 0;
  const amountValid = parsedAmount >= 100;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted mt-1.5 text-sm sm:text-base">
          Manage your NGN balances, deposit funds, and track activity.
        </p>
      </header>

      {depositRef && pollStatus && (
        <DepositStatusBanner
          status={pollStatus as "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"}
        />
      )}

      {success && !depositRef && (
        <AlertBanner variant="success" className="mb-6">
          {success}
        </AlertBanner>
      )}

      <WalletBalanceHero
        total={totalBalance}
        wallets={wallets}
        loading={walletsLoading}
      />

      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Add funds</h2>
                <p className="text-xs text-muted">Secure payment via Flutterwave</p>
              </div>
            </div>

            <form onSubmit={handleDeposit} className="space-y-5">
              <div>
                <p className="text-sm font-medium mb-3">Deposit to</p>
                <div className="grid grid-cols-2 gap-3">
                  {WALLET_OPTIONS.map((opt) => {
                    const selected = walletType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isBusy}
                        onClick={() => setWalletType(opt.value)}
                        className={cn(
                          "text-left p-4 rounded-xl border-2 transition-all",
                          selected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-surface-hover",
                          isBusy && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        <opt.icon
                          className={cn(
                            "w-5 h-5 mb-2",
                            selected ? "text-primary" : "text-muted"
                          )}
                        />
                        <p className="font-medium text-sm">{opt.label}</p>
                        <p className="text-[11px] text-muted mt-0.5 leading-snug">
                          {opt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Quick amount</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setAmount(String(q))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                        amount === String(q)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      ₦{q.toLocaleString("en-NG")}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Custom amount (NGN)"
                type="number"
                min="100"
                step="1"
                placeholder="e.g. 25000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                hint="Minimum deposit ₦100"
                required
                disabled={isBusy}
              />

              {error && <AlertBanner>{error}</AlertBanner>}

              <Button
                type="submit"
                size="lg"
                disabled={isBusy || !amountValid}
                className="w-full gap-2"
              >
                {initiateDeposit.isPending ? (
                  <>
                    <Spinner />
                    Redirecting to Flutterwave…
                  </>
                ) : (
                  <>
                    Continue to payment
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface-hover/80 border border-border/60 p-4">
              <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted leading-relaxed">
                KYC approval required. Card, bank transfer, USSD &amp; more accepted.
                You&apos;ll be redirected to Flutterwave to complete payment securely.
              </p>
            </div>
          </div>
        </section>

        <section className="lg:col-span-3">
          <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">Activity</h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TX_FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setTxFilter(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        txFilter === f
                          ? "bg-primary text-white"
                          : "bg-surface-hover text-muted hover:text-foreground"
                      )}
                    >
                      {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 max-h-[520px] overflow-y-auto">
              {txLoading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : filteredTx.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-surface-hover flex items-center justify-center mx-auto mb-4">
                    <History className="w-7 h-7 text-muted" />
                  </div>
                  <p className="font-medium">No transactions yet</p>
                  <p className="text-sm text-muted mt-1.5 max-w-xs mx-auto">
                    {txFilter === "ALL"
                      ? "Fund your wallet to start trading NGX stocks."
                      : `No ${txFilter.toLowerCase()} transactions in your history.`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredTx.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
