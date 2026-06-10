"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { WalletView } from "@/components/wallet/wallet-view";

export default function WalletPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        }
      >
        <WalletView />
      </Suspense>
    </DashboardLayout>
  );
}
