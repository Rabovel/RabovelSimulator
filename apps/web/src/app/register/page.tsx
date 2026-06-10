"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button, Input, Spinner } from "@/components/ui";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordField } from "@/components/auth/password-field";
import { AlertBanner } from "@/components/auth/alert-banner";
import { LegalModal, type LegalDocType } from "@/components/auth/legal-modal";

const BENEFITS = [
  "Trade NGX-listed stocks",
  "Stake holdings for yield",
  "Secure NGN wallet",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalDocType | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const openLegal = (type: LegalDocType) => setLegalModal(type);
  const closeLegal = () => setLegalModal(null);

  const handleAcceptFromModal = () => {
    setAcceptedTerms(true);
    closeLegal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Please read and accept the Terms of Service and Privacy Policy.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/kyc");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of Nigerian investors building wealth on the NGX."
    >
      <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-6 lg:hidden">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-center gap-1.5 text-xs text-muted">
            <Check className="w-3.5 h-3.5 text-accent shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            placeholder="Ada"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            autoComplete="given-name"
            required
          />
          <Input
            label="Last name"
            placeholder="Okafor"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            autoComplete="family-name"
            required
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
          required
        />

        <PasswordField
          label="Password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="new-password"
          minLength={8}
          showStrength
          required
        />

        <div className="rounded-xl border border-border bg-surface-hover/50 p-4 space-y-3">
          <p className="text-sm font-medium">Terms &amp; conditions</p>
          <p className="text-xs text-muted leading-relaxed">
            Please read our policies before creating an account. You must accept
            both to register.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border bg-surface hover:border-primary/40 hover:text-primary transition-colors"
            >
              Read Terms of Service
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border bg-surface hover:border-primary/40 hover:text-primary transition-colors"
            >
              Read Privacy Policy
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
          <label className="flex items-start gap-3 cursor-pointer group pt-1">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary"
            />
            <span className="text-sm text-muted group-hover:text-foreground transition-colors leading-snug">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={() => openLegal("terms")}
                className="text-primary font-medium hover:underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => openLegal("privacy")}
                className="text-primary font-medium hover:underline"
              >
                Privacy Policy
              </button>
            </span>
          </label>
        </div>

        {error && <AlertBanner>{error}</AlertBanner>}

        <Button
          type="submit"
          className="w-full gap-2"
          size="lg"
          disabled={loading || !acceptedTerms}
        >
          {loading ? (
            <>
              <Spinner />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-muted text-center mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:text-primary-dark transition-colors"
        >
          Sign in
        </Link>
      </p>

      <LegalModal
        type={legalModal}
        open={legalModal !== null}
        onClose={closeLegal}
        onAccept={handleAcceptFromModal}
      />
    </AuthLayout>
  );
}
