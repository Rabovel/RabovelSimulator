"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardView />
    </DashboardLayout>
  );
}
