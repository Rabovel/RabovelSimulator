"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader, Card, Button, Input, Badge } from "@/components/ui";
import { useMarket, useHoldings, usePurchase } from "@/lib/queries";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ApiError } from "@/lib/api";

export default function PortfolioPage() {
  const { data: stocks = [] } = useMarket();
  const { data: holdings = [] } = useHoldings();
  const purchase = usePurchase();
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError("");
    try {
      await purchase.mutateAsync({
        symbol: selected,
        quantity: parseFloat(quantity),
      });
      setQuantity("1");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Purchase failed");
    }
  };

  const selectedStock = stocks.find((s) => s.symbol === selected);

  return (
    <DashboardLayout>
      <PageHeader
        title="Portfolio"
        description="Browse NGX-listed stocks and manage your Nigerian holdings"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className="font-semibold mb-4">Buy Stock</h2>
          <form onSubmit={handlePurchase} className="space-y-4">
            <div>
              <label className="text-sm text-muted">Stock</label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="mt-1.5"
                required
              >
                <option value="">Select a stock</option>
                {stocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {formatCurrency(s.price)}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            {selectedStock && (
              <p className="text-sm text-muted">
                Est. cost:{" "}
                {formatCurrency(selectedStock.price * parseFloat(quantity || "0"))}
              </p>
            )}
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={purchase.isPending}>
              {purchase.isPending ? "Purchasing..." : "Purchase"}
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Your Holdings</h2>
          {holdings.length === 0 ? (
            <p className="text-muted text-sm">No holdings yet. Buy your first stock!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted border-b border-border">
                    <th className="text-left pb-3">Symbol</th>
                    <th className="text-right pb-3">Qty</th>
                    <th className="text-right pb-3">Avg Price</th>
                    <th className="text-right pb-3">Value</th>
                    <th className="text-right pb-3">P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr key={h.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{h.symbol}</p>
                        <p className="text-xs text-muted">{h.name}</p>
                      </td>
                      <td className="text-right">{h.quantity}</td>
                      <td className="text-right">{formatCurrency(h.avgPrice)}</td>
                      <td className="text-right">
                        {formatCurrency(h.marketValue ?? 0)}
                      </td>
                      <td className="text-right">
                        <span
                          className={
                            (h.gainLoss ?? 0) >= 0 ? "text-accent" : "text-danger"
                          }
                        >
                          {formatPercent(h.gainLossPct ?? 0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold mb-4">NGX Market</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stocks.map((s) => (
            <div
              key={s.symbol}
              className="p-4 rounded-lg bg-surface-hover border border-border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{s.symbol}</p>
                  <p className="text-xs text-muted truncate">{s.name}</p>
                  {s.sector && (
                    <p className="text-xs text-muted mt-0.5">{s.sector}</p>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant="success">{formatCurrency(s.price)}</Badge>
                  {s.exchange && (
                    <p className="text-xs text-muted mt-1">{s.exchange}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
