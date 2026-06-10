"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button, Input, Spinner } from "@/components/ui";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordField } from "@/components/auth/password-field";
import { AlertBanner } from "@/components/auth/alert-banner";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [needsMfa, setNeedsMfa] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password, needsMfa ? mfaToken : undefined);
      router.push(user.role === "ADMIN" ? "/admin/users" : "/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.code === "MFA_REQUIRED") {
        setNeedsMfa(true);
        setError("");
      } else {
        setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={needsMfa ? "Two-factor authentication" : "Welcome back"}
      subtitle={
        needsMfa
          ? "Enter the 6-digit code from your authenticator app."
          : "Sign in to manage your NGX portfolio and staking rewards."
      }
    >
      {needsMfa && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">MFA verification required</p>
            <p className="text-xs text-muted mt-0.5">
              Signed in as <span className="text-foreground">{email}</span>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!needsMfa ? (
          <>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <PasswordField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </>
        ) : (
          <Input
            label="Authentication code"
            placeholder="000000"
            value={mfaToken}
            onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            hint="Open your authenticator app to get your code."
            className="tracking-[0.3em] text-center text-lg font-mono"
            required
          />
        )}

        {error && <AlertBanner>{error}</AlertBanner>}

        <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Spinner />
              {needsMfa ? "Verifying..." : "Signing in..."}
            </>
          ) : (
            <>
              {needsMfa ? "Verify & sign in" : "Sign in"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        {needsMfa && (
          <button
            type="button"
            onClick={() => {
              setNeedsMfa(false);
              setMfaToken("");
              setError("");
            }}
            className="w-full text-sm text-muted hover:text-foreground transition-colors"
          >
            Use a different account
          </button>
        )}
      </form>

      {!needsMfa && (
        <p className="text-sm text-muted text-center mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Create one free
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
