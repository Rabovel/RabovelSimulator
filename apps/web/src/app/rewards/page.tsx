"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader, Card, StatCard, Badge } from "@/components/ui";
import { useRewards } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { Gift } from "lucide-react";

export default function RewardsPage() {
  const { data } = useRewards();
  const rewards = data?.rewards ?? [];
  const total = data?.totalEarned ?? 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Rewards"
        description="Track your staking yields and bonus rewards"
      />

      <div className="mb-8 max-w-sm">
        <StatCard
          label="Total Earned"
          value={formatCurrency(total)}
          icon={<Gift className="w-5 h-5" />}
        />
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Reward History</h2>
        {rewards.length === 0 ? (
          <p className="text-muted text-sm">No rewards distributed yet.</p>
        ) : (
          <div className="space-y-3">
            {rewards.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">
                    {r.description ?? r.type.replace("_", " ")}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(r.distributedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-accent">
                    +{formatCurrency(r.amount)}
                  </p>
                  <Badge variant="success">{r.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
