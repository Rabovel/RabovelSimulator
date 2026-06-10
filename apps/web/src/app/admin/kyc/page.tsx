"use client";

import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import {
  useAdminKycList,
  useAdminKycApprove,
  useAdminKycReject,
} from "@/lib/queries";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
] as const;

function docLabel(type?: string) {
  const map: Record<string, string> = {
    NATIONAL_ID: "National ID (NIN)",
    PASSPORT: "International Passport",
    DRIVERS_LICENSE: "Driver's License",
  };
  return type ? map[type] ?? type : "—";
}

export default function AdminKycPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>("PENDING");
  const { data: submissions = [], isLoading, isFetching } = useAdminKycList(tab);
  const approve = useAdminKycApprove();
  const reject = useAdminKycReject();

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [error, setError] = useState("");

  const actionId = approve.isPending
    ? approve.variables
    : reject.isPending
      ? reject.variables?.kycId
      : null;

  const handleApprove = async (kycId: string) => {
    setError("");
    try {
      await approve.mutateAsync(kycId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Approval failed");
    }
  };

  const handleReject = async (kycId: string) => {
    if (rejectNote.length < 5) return;
    setError("");
    try {
      await reject.mutateAsync({ kycId, rejectionNote: rejectNote });
      setRejectId(null);
      setRejectNote("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Rejection failed");
    }
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="KYC Review"
        description="Manually approve or reject identity submissions"
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={refresh}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-primary text-white"
                : "bg-surface border border-border text-muted hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <Card className="py-16 text-center text-muted">Loading submissions…</Card>
      ) : submissions.length === 0 ? (
        <Card className="py-16 text-center">
          <ShieldCheck className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="font-medium">No submissions in this queue</p>
          <p className="text-sm text-muted mt-1">
            {tab === "PENDING"
              ? "New KYC submissions will appear here for review."
              : "Try another filter."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <Card key={s.id}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {s.user.firstName} {s.user.lastName}
                    </h3>
                    <Badge
                      variant={
                        s.status === "APPROVED"
                          ? "success"
                          : s.status === "PENDING"
                            ? "warning"
                            : s.status === "REJECTED"
                              ? "danger"
                              : "default"
                      }
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">{s.user.email}</p>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted text-xs">Document</p>
                      <p className="font-medium">{docLabel(s.documentType)}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs">Document number</p>
                      <p className="font-medium font-mono">
                        {s.documentNumber ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted text-xs">Date of birth</p>
                      <p className="font-medium">
                        {s.dateOfBirth
                          ? new Date(s.dateOfBirth).toLocaleDateString("en-NG")
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted text-xs">Submitted</p>
                      <p className="font-medium">
                        {s.submittedAt
                          ? new Date(s.submittedAt).toLocaleString("en-NG")
                          : "—"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted text-xs">Address</p>
                      <p className="font-medium">{s.address ?? "—"}</p>
                    </div>
                    {s.rejectionNote && (
                      <div className="sm:col-span-2">
                        <p className="text-muted text-xs">Rejection note</p>
                        <p className="text-danger text-sm">{s.rejectionNote}</p>
                      </div>
                    )}
                  </div>
                </div>

                {s.status === "PENDING" && (
                  <div className="flex flex-col gap-2 shrink-0 lg:w-48">
                    {rejectId === s.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={rejectNote}
                          onChange={(e) => setRejectNote(e.target.value)}
                          placeholder="Reason for rejection (min 5 chars)"
                          rows={3}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            className="flex-1"
                            disabled={actionId === s.id || rejectNote.length < 5}
                            onClick={() => handleReject(s.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRejectId(null);
                              setRejectNote("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Button
                          className="gap-2"
                          disabled={actionId === s.id}
                          onClick={() => handleApprove(s.id)}
                        >
                          {actionId === s.id ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          className="gap-2"
                          disabled={actionId === s.id}
                          onClick={() => setRejectId(s.id)}
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
