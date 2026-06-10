"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader, Card, Button, Input, Badge } from "@/components/ui";
import { useStakes, useHoldings, useCreateStake } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { ApiError } from "@/lib/api";

export default function StakingPage() {
  const { data: stakes = [] } = useStakes();
  const { data: holdings = [] } = useHoldings();
  const createStake = useCreateStake();
  const [holdingId, setHoldingId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createStake.mutateAsync({
        holdingId,
        amount: parseFloat(amount),
      });
      setAmount("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Staking failed");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Staking"
        description="Stake your holdings to earn 8.5% APY"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className="font-semibold mb-4">Create Stake</h2>
          <form onSubmit={handleStake} className="space-y-4">
            <div>
              <label className="text-sm text-muted">Holding</label>
              <select
                value={holdingId}
                onChange={(e) => setHoldingId(e.target.value)}
                className="mt-1.5"
                required
              >
                <option value="">Select holding</option>
                {holdings.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.symbol} — {h.quantity} shares
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Amount to stake"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={createStake.isPending}>
              {createStake.isPending ? "Staking..." : "Stake now"}
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Active Stakes</h2>
          {stakes.length === 0 ? (
            <p className="text-muted text-sm">No active stakes.</p>
          ) : (
            <div className="space-y-3">
              {stakes.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-surface-hover border border-border"
                >
                  <div>
                    <p className="font-medium">{s.holding.symbol}</p>
                    <p className="text-xs text-muted">{s.holding.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{s.amount} shares</p>
                    <p className="text-xs text-primary">{s.apy}% APY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      ~{formatCurrency(s.estimatedAnnualYield ?? 0)}/yr
                    </p>
                    <Badge
                      variant={s.status === "ACTIVE" ? "success" : "default"}
                    >
                      {s.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
