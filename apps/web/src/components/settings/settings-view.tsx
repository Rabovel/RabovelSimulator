"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Smartphone,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { Button, Card, Badge, Input, PageHeader } from "@/components/ui";
import { AlertBanner } from "@/components/auth/alert-banner";
import { PasswordField } from "@/components/auth/password-field";
import { cn } from "@/lib/utils";

type MfaStep = "idle" | "setup" | "verify";

export function SettingsView() {
  const { user, token, refreshUser } = useAuth();
  const [mfaStep, setMfaStep] = useState<MfaStep>("idle");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualSecret, setManualSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleStartSetup = async () => {
    if (!token) return;
    clearMessages();
    setLoading(true);
    try {
      const { secret, qrCode: qr } = await api.mfaSetup(token);
      setManualSecret(secret);
      setQrCode(qr);
      setMfaStep("setup");
      setVerifyCode("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to start MFA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || verifyCode.length !== 6) return;
    clearMessages();
    setLoading(true);
    try {
      await api.mfaEnable(token, { token: verifyCode });
      await refreshUser();
      setMfaStep("idle");
      setQrCode(null);
      setManualSecret(null);
      setVerifyCode("");
      setSuccess("Two-factor authentication is now enabled on your account.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || disableCode.length !== 6 || !disablePassword) return;
    clearMessages();
    setLoading(true);
    try {
      await api.mfaDisable(token, {
        password: disablePassword,
        token: disableCode,
      });
      await refreshUser();
      setDisablePassword("");
      setDisableCode("");
      setSuccess("Two-factor authentication has been disabled.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to disable MFA");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = async () => {
    if (!manualSecret) return;
    await navigator.clipboard.writeText(manualSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cancelSetup = () => {
    setMfaStep("idle");
    setQrCode(null);
    setManualSecret(null);
    setVerifyCode("");
    clearMessages();
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Settings"
        description="Manage your account and security preferences"
      />

      {error && (
        <AlertBanner variant="error" className="mb-6">
          {error}
        </AlertBanner>
      )}
      {success && (
        <AlertBanner variant="success" className="mb-6">
          {success}
        </AlertBanner>
      )}

      {/* Account */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold">Account</h2>
            <p className="text-sm text-muted">Your profile information</p>
          </div>
        </div>

        <dl className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-border">
            <dt className="text-sm text-muted">Full name</dt>
            <dd className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3">
            <dt className="text-sm text-muted">Email address</dt>
            <dd className="text-sm font-medium">{user.email}</dd>
          </div>
        </dl>
      </Card>

      {/* Security / MFA */}
      <Card>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Two-factor authentication</h2>
              <p className="text-sm text-muted">
                Add an extra layer of security with an authenticator app
              </p>
            </div>
          </div>
          <Badge variant={user.mfaEnabled ? "success" : "default"}>
            {user.mfaEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {user.mfaEnabled ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-accent">MFA is active</p>
                <p className="text-muted mt-1">
                  You&apos;ll need a code from your authenticator app each time you sign in.
                </p>
              </div>
            </div>

            <form onSubmit={handleDisableMfa} className="space-y-4 pt-2 border-t border-border">
              <p className="text-sm font-medium flex items-center gap-2 text-muted">
                <ShieldOff className="w-4 h-4" />
                Disable two-factor authentication
              </p>
              <PasswordField
                label="Current password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <div>
                <label className="text-sm font-medium text-foreground">
                  Authenticator code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={disableCode}
                  onChange={(e) =>
                    setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="mt-1.5 text-center text-lg tracking-[0.3em] font-mono"
                  required
                />
                <p className="text-xs text-muted mt-1.5">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              <Button
                type="submit"
                variant="danger"
                disabled={loading || disableCode.length !== 6 || !disablePassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Disabling...
                  </>
                ) : (
                  "Disable MFA"
                )}
              </Button>
            </form>
          </div>
        ) : mfaStep === "setup" && qrCode ? (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted">
                <p className="font-medium text-foreground mb-1">Set up your authenticator</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Install Google Authenticator, Authy, or similar</li>
                  <li>Scan the QR code or enter the secret manually</li>
                  <li>Enter the 6-digit code to confirm</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-background border border-border">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCode} alt="MFA QR code" width={180} height={180} />
              </div>

              {manualSecret && (
                <div className="w-full max-w-sm">
                  <p className="text-xs text-muted text-center mb-2">
                    Or enter this key manually
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono bg-surface-hover px-3 py-2 rounded-lg border border-border truncate">
                      {manualSecret}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className={cn(
                        "p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors",
                        copied && "text-accent border-accent/30"
                      )}
                      aria-label="Copy secret"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleEnableMfa} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="mt-1.5 text-center text-lg tracking-[0.3em] font-mono"
                  autoFocus
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={loading || verifyCode.length !== 6}
                  className="sm:flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Enable MFA"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelSetup}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted leading-relaxed">
              Protect your account with time-based one-time passwords (TOTP). When enabled,
              you&apos;ll enter a code from your authenticator app in addition to your
              password when signing in.
            </p>
            <Button onClick={handleStartSetup} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Preparing...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Set up authenticator
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
