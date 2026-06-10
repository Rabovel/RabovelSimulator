"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  IdCard,
  BookUser,
  Car,
  Lock,
  Wallet,
  LineChart,
  Layers,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Card } from "@/components/ui";
import { type Kyc, ApiError } from "@/lib/api";
import { useSubmitKyc } from "@/lib/queries";

const STEPS = [
  { id: 1, label: "Account" },
  { id: 2, label: "Documents" },
  { id: 3, label: "Review" },
  { id: 4, label: "Verified" },
];

const DOCUMENT_TYPES = [
  {
    value: "NATIONAL_ID",
    label: "National ID (NIN)",
    description: "11-digit NIN from NIMC",
    icon: IdCard,
  },
  {
    value: "PASSPORT",
    label: "International Passport",
    description: "Nigerian passport booklet",
    icon: BookUser,
  },
  {
    value: "DRIVERS_LICENSE",
    label: "Driver's License",
    description: "Valid FRSC license",
    icon: Car,
  },
] as const;

const UNLOCKED_FEATURES = [
  { icon: Wallet, label: "Fund your NGN wallet" },
  { icon: LineChart, label: "Trade NGX-listed stocks" },
  { icon: Layers, label: "Stake holdings for yield" },
];

function getActiveStep(status: string | undefined): number {
  switch (status) {
    case "APPROVED":
      return 4;
    case "PENDING":
      return 3;
    case "REJECTED":
    case "NOT_STARTED":
    default:
      return 2;
  }
}

function ProgressStepper({ status }: { status?: string }) {
  const active = getActiveStep(status);

  return (
    <nav aria-label="Verification progress" className="w-full">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const done = step.id < active;
          const current = step.id === active;
          const last = i === STEPS.length - 1;

          return (
            <li
              key={step.id}
              className={cn("flex items-center", !last && "flex-1")}
            >
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors shrink-0",
                    done && "bg-primary border-primary text-white",
                    current && "border-primary text-primary bg-primary/10",
                    !done && !current && "border-border text-muted bg-surface"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium hidden sm:block",
                    current ? "text-primary" : "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!last && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-colors",
                    step.id < active ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StatusHero({
  status,
  submittedAt,
  rejectionNote,
}: {
  status: string;
  submittedAt?: string;
  rejectionNote?: string;
}) {
  const configs = {
    APPROVED: {
      icon: CheckCircle2,
      iconBg: "bg-accent/15 text-accent",
      title: "Identity verified",
      description:
        "Your KYC is complete. You can fund your wallet, trade NGX stocks, and stake holdings.",
    },
    PENDING: {
      icon: Clock,
      iconBg: "bg-warning/15 text-warning",
      title: "Under review",
      description:
        "We're reviewing your documents. Most verifications complete within 1–2 business days.",
    },
    REJECTED: {
      icon: XCircle,
      iconBg: "bg-danger/15 text-danger",
      title: "Verification unsuccessful",
      description:
        rejectionNote ??
        "Your submission couldn't be verified. Please review your details and try again.",
    },
    NOT_STARTED: {
      icon: ShieldCheck,
      iconBg: "bg-primary/10 text-primary",
      title: "Verify your identity",
      description:
        "Complete KYC to unlock wallet funding, NGX trading, and staking on Raboovel Earn.",
    },
  };

  const config = configs[status as keyof typeof configs] ?? configs.NOT_STARTED;
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            config.iconBg
          )}
        >
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">{config.title}</h2>
          <p className="text-muted text-sm mt-1.5 leading-relaxed">
            {config.description}
          </p>
          {submittedAt && status === "PENDING" && (
            <p className="text-xs text-muted mt-3">
              Submitted {new Date(submittedAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function RequirementsPanel({ status }: { status?: string }) {
  const verified = status === "APPROVED";

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-semibold text-sm">
          {verified ? "Unlocked features" : "What you'll unlock"}
        </h3>
        <ul className="mt-4 space-y-3">
          {UNLOCKED_FEATURES.map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  verified
                    ? "bg-accent/15 text-accent"
                    : "bg-surface-hover text-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <span
                className={cn(
                  "text-sm",
                  verified ? "text-foreground" : "text-muted"
                )}
              >
                {item.label}
              </span>
              {verified && (
                <CheckCircle2 className="w-4 h-4 text-accent ml-auto shrink-0" />
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Your data is protected</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Information is encrypted in transit and at rest. We only use it for
              regulatory compliance and account security.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-sm mb-3">Required documents</h3>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="text-primary font-medium">1.</span>
            Valid government-issued ID (NIN, passport, or license)
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium">2.</span>
            Date of birth matching your ID
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium">3.</span>
            Current residential address in Nigeria
          </li>
        </ul>
      </Card>
    </div>
  );
}

function KycForm() {
  const submitKyc = useSubmitKyc();
  const [form, setForm] = useState({
    documentType: "NATIONAL_ID" as (typeof DOCUMENT_TYPES)[number]["value"],
    documentNumber: "",
    dateOfBirth: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const docHint =
    form.documentType === "NATIONAL_ID"
      ? "Enter your 11-digit National Identification Number"
      : form.documentType === "PASSPORT"
        ? "Enter your passport number as shown on the document"
        : "Enter your driver's license number";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await submitKyc.mutateAsync({
        ...form,
        dateOfBirth: new Date(form.dateOfBirth).toISOString(),
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Submission failed");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <div className="mb-4">
            <h3 className="font-semibold">Identity document</h3>
            <p className="text-sm text-muted mt-1">
              Select the document you'll use for verification
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {DOCUMENT_TYPES.map((doc) => {
              const selected = form.documentType === doc.value;
              return (
                <button
                  key={doc.value}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, documentType: doc.value })
                  }
                  className={cn(
                    "relative text-left p-4 rounded-xl border-2 transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-surface hover:border-primary/40 hover:bg-surface-hover"
                  )}
                >
                  <doc.icon
                    className={cn(
                      "w-5 h-5 mb-3",
                      selected ? "text-primary" : "text-muted"
                    )}
                  />
                  <p className="font-medium text-sm">{doc.label}</p>
                  <p className="text-xs text-muted mt-1">{doc.description}</p>
                  {selected && (
                    <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="font-semibold">Personal details</h3>
            <p className="text-sm text-muted mt-1">
              Must match the information on your ID exactly
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="doc-number" className="text-sm font-medium">
              Document number
            </label>
            <input
              id="doc-number"
              value={form.documentNumber}
              onChange={(e) =>
                setForm({ ...form, documentNumber: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, documentNumber: true })}
              placeholder={
                form.documentType === "NATIONAL_ID"
                  ? "e.g. 12345678901"
                  : "Enter document number"
              }
              required
              className={cn(
                touched.documentNumber &&
                  !form.documentNumber &&
                  "border-danger"
              )}
            />
            <p className="text-xs text-muted">{docHint}</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="dob" className="text-sm font-medium">
              Date of birth
            </label>
            <input
              id="dob"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="font-semibold">Residential address</h3>
            <p className="text-sm text-muted mt-1">
              Your current address in Nigeria
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="address" className="text-sm font-medium">
              Full address
            </label>
            <textarea
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              placeholder="Street, city, state, postal code"
              required
            />
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-danger/10 border border-danger/20">
            <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted mb-4 leading-relaxed">
            By submitting, you confirm the information provided is accurate and
            consent to identity verification in line with CBN and NGX
            regulations.
          </p>
          <Button
            type="submit"
            disabled={submitKyc.isPending}
            className="w-full sm:w-auto gap-2"
          >
            {submitKyc.isPending ? "Submitting..." : "Submit for verification"}
            {!submitKyc.isPending && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ApprovedActions() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {[
          { href: "/wallet", label: "Fund wallet", icon: Wallet },
          { href: "/portfolio", label: "Trade stocks", icon: LineChart },
          { href: "/staking", label: "Start staking", icon: Layers },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-center gap-2 p-5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function KycVerification({ kyc }: { kyc: Kyc | null }) {
  const status = kyc?.status ?? "NOT_STARTED";
  const canSubmit = status === "NOT_STARTED" || status === "REJECTED";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Identity verification</h1>
        <p className="text-muted mt-1.5 text-sm sm:text-base">
          Complete KYC to comply with Nigerian financial regulations and unlock
          full platform access.
        </p>
      </div>

      <ProgressStepper status={status} />

      <StatusHero
        status={status}
        submittedAt={kyc?.submittedAt}
        rejectionNote={kyc?.rejectionNote}
      />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {canSubmit && (
            <KycForm />
          )}
          {status === "PENDING" && (
            <Card className="text-center py-10">
              <Clock className="w-10 h-10 text-warning mx-auto mb-4" />
              <p className="font-medium">No action needed right now</p>
              <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
                We'll notify you once your verification is complete. You can
                continue browsing while you wait.
              </p>
            </Card>
          )}
          {status === "APPROVED" && <ApprovedActions />}
        </div>

        <div className="lg:col-span-1">
          <RequirementsPanel status={status} />
        </div>
      </div>
    </div>
  );
}

export function KycLoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-border rounded-lg w-64" />
        <div className="h-4 bg-border rounded w-96 max-w-full" />
      </div>
      <div className="h-12 bg-border rounded-xl" />
      <div className="h-32 bg-border rounded-xl" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-border rounded-xl" />
        <div className="h-64 bg-border rounded-xl" />
      </div>
    </div>
  );
}
