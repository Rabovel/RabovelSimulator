"use client";

import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ArrowRightLeft,
  Layers,
  UserPlus,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader, Card, StatCard, Badge } from "@/components/ui";
import { useAdminUserMetrics } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

function kycBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "danger"> = {
    APPROVED: "success",
    PENDING: "warning",
    REJECTED: "danger",
    NOT_STARTED: "default",
  };
  return map[status] ?? "default";
}

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminUserMetrics();
  const s = data?.summary;

  return (
    <DashboardLayout>
      <PageHeader
        title="Users & Metrics"
        description="Platform overview and registered users"
        action={
          <Link
            href="/admin/kyc"
            className="text-sm text-primary font-medium hover:underline"
          >
            Review KYC →
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-28 animate-pulse bg-surface-hover">
              <span className="sr-only">Loading</span>
            </Card>
          ))}
        </div>
      ) : s && data ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total users"
              value={String(s.totalUsers)}
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="KYC pending"
              value={String(s.kycPending)}
              sub={`${s.kycApproved} approved · ${s.kycRejected} rejected`}
              icon={<ShieldCheck className="w-5 h-5" />}
            />
            <StatCard
              label="Active stakes"
              value={String(s.activeStakes)}
              sub={`${s.totalTransactions} transactions`}
              icon={<Layers className="w-5 h-5" />}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <p className="text-sm text-muted">Total revenue</p>
              <p className="text-xl font-bold mt-1">
                {formatCurrency(s.totalDeposits)}
              </p>
              <p className="text-xs text-muted mt-1">Completed deposits from all users</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">KYC not started</p>
              <p className="text-xl font-bold mt-1">{s.kycNotStarted}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">KYC approved</p>
              <p className="text-xl font-bold mt-1 text-accent">{s.kycApproved}</p>
            </Card>
          </div>

          <Card>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              All users
            </h2>
            {data.users.length === 0 ? (
              <p className="text-sm text-muted">No registered users yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted border-b border-border text-left">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 pr-4">KYC</th>
                      <th className="pb-3 pr-4 text-right">Wallet</th>
                      <th className="pb-3 pr-4 text-right">Holdings</th>
                      <th className="pb-3 pr-4 text-right">Stakes</th>
                      <th className="pb-3 text-right">Txns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 pr-4">
                          <p className="font-medium">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-muted">{u.email}</p>
                          <p className="text-xs text-muted mt-0.5">
                            Joined{" "}
                            {new Date(u.createdAt).toLocaleDateString("en-NG")}
                          </p>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={kycBadge(u.kycStatus)}>
                            {u.kycStatus.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-right font-medium">
                          {formatCurrency(u.walletBalance)}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          {u.holdingsCount}
                        </td>
                        <td className="py-3 pr-4 text-right">{u.stakesCount}</td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3 text-muted" />
                            {u.transactionsCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      ) : null}
    </DashboardLayout>
  );
}
