"use client";

import Link from "next/link";
import {
  Wallet,
  LineChart,
  Layers,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  TrendingUp,
  ChevronRight,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSummary, useTransactions } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import type { Transaction } from "@/lib/api";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

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

const QUICK_ACTIONS = [
  {
    href: "/wallet",
    label: "Fund wallet",
    description: "Deposit via Flutterwave",
    icon: CreditCard,
    accent: "primary",
  },
  {
    href: "/portfolio",
    label: "Trade stocks",
    description: "Browse NGX equities",
    icon: LineChart,
    accent: "primary",
  },
  {
    href: "/staking",
    label: "Stake holdings",
    description: "Earn 8.5% APY",
    icon: Layers,
    accent: "accent",
  },
  {
    href: "/rewards",
    label: "View rewards",
    description: "Track your yield",
    icon: Gift,
    accent: "accent",
  },
] as const;

function MetricTile({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
  loading,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Wallet;
  accent?: "primary" | "accent";
  loading?: boolean;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted">{label}</p>
          {loading ? (
            <div className="h-8 w-28 bg-surface-hover rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="text-xl sm:text-2xl font-bold mt-1 tracking-tight truncate">
              {value}
            </p>
          )}
          {sub && !loading && (
            <p className="text-xs text-muted mt-1">{sub}</p>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            accent === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function AllocationBar({
  walletBalance,
  portfolioValue,
  loading,
}: {
  walletBalance: number;
  portfolioValue: number;
  loading?: boolean;
}) {
  const total = walletBalance + portfolioValue;
  const walletPct = total > 0 ? (walletBalance / total) * 100 : 50;
  const portfolioPct = total > 0 ? (portfolioValue / total) * 100 : 50;

  return (
    <div className="mt-6 pt-6 border-t border-white/10">
      <div className="flex justify-between text-xs text-white/60 mb-2">
        <span>Wallet {loading ? "—" : `${walletPct.toFixed(0)}%`}</span>
        <span>Portfolio {loading ? "—" : `${portfolioPct.toFixed(0)}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
        {loading ? (
          <div className="h-full w-full bg-white/20 animate-pulse" />
        ) : (
          <>
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${walletPct}%` }}
            />
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${portfolioPct}%` }}
            />
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm">
        <span className="flex items-center gap-2 text-white/80">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Cash {loading ? "—" : formatCurrency(walletBalance)}
        </span>
        <span className="flex items-center gap-2 text-white/80">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Holdings {loading ? "—" : formatCurrency(portfolioValue)}
        </span>
      </div>
    </div>
  );
}

function RecentActivityItem({ tx }: { tx: Transaction }) {
  const Icon = txIcon(tx.type);
  const isCredit = tx.type === "DEPOSIT" || tx.type === "REWARD" || tx.type === "SALE";

  return (
    <div className="flex items-center gap-3 py-3.5 group">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          txIconStyle(tx.type)
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {tx.description ?? tx.type.replace("_", " ")}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {new Date(tx.createdAt).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
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

function SnapshotItem({
  label,
  value,
  loading,
}: {
  label: string;
  value: string | number;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted">{label}</span>
      {loading ? (
        <div className="h-5 w-12 bg-surface-hover rounded animate-pulse" />
      ) : (
        <span className="font-semibold">{value}</span>
      )}
    </div>
  );
}

export function DashboardView() {
  const { user } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const recent = transactions.slice(0, 6);

  const firstName = user?.firstName ?? "there";

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <p className="text-sm text-muted">{getGreeting()}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-0.5">
          {firstName}
        </h1>
        <p className="text-muted mt-1.5 text-sm sm:text-base">
          Here&apos;s your NGX portfolio at a glance.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-2xl bg-dark text-white p-6 sm:p-8 mb-8">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 90% 10%, #4a6cf7 0%, transparent 50%), radial-gradient(ellipse 55% 50% at 10% 90%, #34d399 0%, transparent 45%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Sparkles className="w-4 h-4" />
            Total net worth
          </div>
          {summaryLoading ? (
            <div className="h-12 w-56 bg-white/10 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="text-4xl sm:text-5xl font-bold tracking-tight mt-2">
              {summary ? formatCurrency(summary.totalValue) : "—"}
            </p>
          )}
          <AllocationBar
            walletBalance={summary?.walletBalance ?? 0}
            portfolioValue={summary?.portfolioValue ?? 0}
            loading={summaryLoading}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <MetricTile
          label="Wallet balance"
          value={summary ? formatCurrency(summary.walletBalance) : "—"}
          icon={Wallet}
          loading={summaryLoading}
        />
        <MetricTile
          label="Portfolio value"
          value={summary ? formatCurrency(summary.portfolioValue) : "—"}
          icon={LineChart}
          loading={summaryLoading}
        />
        <MetricTile
          label="Staked"
          value={summary ? formatCurrency(summary.totalStaked) : "—"}
          sub={
            summary
              ? `${summary.activeStakes} active stake${summary.activeStakes === 1 ? "" : "s"}`
              : undefined
          }
          icon={Layers}
          accent="accent"
          loading={summaryLoading}
        />
        <MetricTile
          label="Rewards earned"
          value={summary ? formatCurrency(summary.totalRewards) : "—"}
          icon={Gift}
          accent="accent"
          loading={summaryLoading}
        />
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  action.accent === "accent"
                    ? "bg-accent/15 text-accent"
                    : "bg-primary/15 text-primary"
                )}
              >
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-muted truncate">{action.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">Recent activity</h2>
            </div>
            <Link
              href="/wallet"
              className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="px-6">
            {txLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : recent.length === 0 ? (
              <div className="py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-hover flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-muted" />
                </div>
                <p className="font-medium">No activity yet</p>
                <p className="text-sm text-muted mt-1.5 max-w-xs mx-auto">
                  Fund your wallet and start trading NGX-listed stocks.
                </p>
                <Link
                  href="/wallet"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Add funds
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recent.map((tx) => (
                  <RecentActivityItem key={tx.id} tx={tx} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold text-lg mb-1">Portfolio snapshot</h2>
          <p className="text-xs text-muted mb-4">Live stats from your account</p>
          <SnapshotItem
            label="Holdings"
            value={summary?.holdingsCount ?? 0}
            loading={summaryLoading}
          />
          <SnapshotItem
            label="Active stakes"
            value={summary?.activeStakes ?? 0}
            loading={summaryLoading}
          />
          <SnapshotItem
            label="Transactions"
            value={summary?.transactionCount ?? 0}
            loading={summaryLoading}
          />
          <Link
            href="/kyc"
            className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-surface-hover/50 p-4 hover:border-primary/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Identity verification</p>
              <p className="text-xs text-muted">Required for deposits &amp; trading</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary" />
          </Link>
        </section>
      </div>
    </div>
  );
}
