"use client";

import Link from "next/link";
import { useState } from "react";
import {
  TrendingUp,
  Shield,
  Layers,
  BarChart3,
  ArrowRight,
  Menu,
  X,
  Wallet,
  Gift,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
];

const STATS = [
  { value: "8.5%", label: "Max staking APY" },
  { value: "NGX", label: "Listed equities" },
  { value: "24/7", label: "Platform access" },
  { value: "MFA", label: "Account protection" },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "NGX stock trading",
    description:
      "Buy and sell shares of Dangote, MTN, GTCO, Zenith Bank, and other Nigerian Exchange-listed equities.",
    accent: "primary",
  },
  {
    icon: Layers,
    title: "Staking rewards",
    description:
      "Stake your holdings at competitive APY and earn passive income on top of market returns.",
    accent: "accent",
  },
  {
    icon: Wallet,
    title: "NGN wallets",
    description:
      "Fund your account via Flutterwave, track balances in real time, and manage deposits securely.",
    accent: "primary",
  },
  {
    icon: Gift,
    title: "Reward distribution",
    description:
      "Daily yield payouts land directly in your primary wallet — transparent and automatic.",
    accent: "accent",
  },
  {
    icon: ShieldCheck,
    title: "KYC verification",
    description:
      "Complete identity verification to unlock full trading, staking, and withdrawal capabilities.",
    accent: "primary",
  },
  {
    icon: Zap,
    title: "Real-time portfolio",
    description:
      "Live holdings, allocation breakdown, and transaction history in one unified dashboard.",
    accent: "accent",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up in minutes with email and password. Enable MFA for extra protection.",
  },
  {
    step: "02",
    title: "Verify your identity",
    description: "Submit KYC documents so we can keep the platform safe and compliant.",
  },
  {
    step: "03",
    title: "Fund & trade",
    description: "Deposit NGN via Flutterwave, then buy NGX equities from the portfolio page.",
  },
  {
    step: "04",
    title: "Stake & earn",
    description: "Lock holdings into stakes and watch daily rewards flow into your wallet.",
  },
];

const SECURITY_ITEMS = [
  "JWT authentication with encrypted sessions",
  "TOTP multi-factor authentication (MFA)",
  "Rate limiting and Helmet security headers",
  "Full audit logging on sensitive actions",
  "Role-based admin access controls",
];

const TICKERS = [
  { symbol: "DANGCEM", price: "₦285.50", change: "+1.2%", up: true },
  { symbol: "MTNN", price: "₦210.00", change: "+0.8%", up: true },
  { symbol: "GTCO", price: "₦38.95", change: "-0.3%", up: false },
  { symbol: "ZENITHBANK", price: "₦36.20", change: "+0.5%", up: true },
];

function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group", className)}>
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
        <TrendingUp className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-lg tracking-tight">Raboovel Earn</span>
    </Link>
  );
}

function HeroPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      <div
        className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #4a6cf7 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, #34d399 0%, transparent 50%)",
        }}
      />
      <div className="relative bg-surface border border-border rounded-2xl shadow-xl shadow-primary/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-hover/50">
          <div>
            <p className="text-xs text-muted font-medium">Portfolio value</p>
            <p className="text-2xl font-bold tracking-tight mt-0.5">₦2,847,500.00</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            +12.4%
          </div>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">
            Market watch
          </p>
          {TICKERS.map((t) => (
            <div
              key={t.symbol}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-background/80 border border-border/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LineChart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.symbol}</p>
                  <p className="text-xs text-muted">{t.price}</p>
                </div>
              </div>
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  t.up ? "text-accent" : "text-danger"
                )}
              >
                {t.change}
              </span>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-border bg-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Active stake</span>
          </div>
          <span className="text-sm font-bold text-primary">8.5% APY</span>
        </div>
      </div>
    </div>
  );
}

export function LandingView() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo />

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1.5">
                Get started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-surface-hover text-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-surface px-5 py-4 space-y-3 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-muted hover:text-foreground py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Get started</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                Nigerian stocks · NGX · Staking
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] tracking-tight">
                Grow your NGX portfolio with{" "}
                <span className="text-primary">smart staking</span> rewards
              </h1>

              <p className="text-muted text-lg sm:text-xl mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Trade Nigerian Exchange-listed equities, stake your holdings for
                yield, and track rewards — one secure platform built for Nigerian
                investors.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-10">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Create free account
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Sign in to dashboard
                  </Button>
                </Link>
              </div>

              <ul className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-sm text-muted">
                {["No minimum deposit", "Flutterwave payments", "MFA supported"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="animate-fade-in [animation-delay:120ms]">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 sm:px-6 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Platform features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to invest in Nigeria
          </h2>
          <p className="text-muted mt-4 text-lg">
            From your first deposit to daily staking payouts — designed for clarity,
            speed, and confidence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105",
                  feature.accent === "accent"
                    ? "bg-accent/15 text-accent"
                    : "bg-primary/10 text-primary"
                )}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-muted text-sm mt-2 leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-surface border-y border-border py-20 sm:py-28"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Start earning in four simple steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((item, i) => (
              <div key={item.step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
                )}
                <div className="bg-background border border-border rounded-2xl p-6 h-full">
                  <span className="text-3xl font-bold text-primary/20">{item.step}</span>
                  <h3 className="font-semibold text-lg mt-3">{item.title}</h3>
                  <p className="text-muted text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get started now
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="relative overflow-hidden bg-dark text-white py-20 sm:py-28">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 20%, #4a6cf7 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #34d399 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-6">
                <Shield className="w-4 h-4 text-primary" />
                Security first
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Built for trust,
                <br />
                <span className="text-primary">not just speed</span>
              </h2>
              <p className="text-white/60 mt-4 text-lg leading-relaxed max-w-lg">
                Your funds and data are protected with industry-standard security
                practices — from authentication to audit trails.
              </p>
            </div>

            <ul className="space-y-4">
              {SECURITY_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-20 sm:py-28 text-center">
        <div className="bg-surface border border-border rounded-3xl p-10 sm:p-14 shadow-xl shadow-primary/5 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-primary) 20%, transparent) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
              Ready to grow your NGX portfolio?
            </h2>
            <p className="text-muted mt-4 text-lg max-w-xl mx-auto">
              Join Raboovel Earn today — create your account, complete KYC, and
              start trading and staking in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <BrandLogo />
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Register
              </Link>
            </nav>
          </div>
          <p className="text-xs text-muted mt-8 pt-8 border-t border-border">
            &copy; {new Date().getFullYear()} Raboovel Earn. Nigerian stock trading and
            staking platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
