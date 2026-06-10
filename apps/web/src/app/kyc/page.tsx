"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  KycVerification,
  KycLoadingSkeleton,
} from "@/components/kyc-verification";
import { useKycStatus } from "@/lib/queries";

export default function KycPage() {
  const { data: kyc, isLoading } = useKycStatus();

  return (
    <DashboardLayout>
      {isLoading ? (
        <KycLoadingSkeleton />
      ) : (
        <KycVerification kyc={kyc ?? null} />
      )}
    </DashboardLayout>
  );
}
