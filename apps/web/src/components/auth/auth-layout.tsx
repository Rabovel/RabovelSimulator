"use client";

import Link from "next/link";
import { TrendingUp, Shield, BarChart3, Layers } from "lucide-react";
import { type ReactNode } from "react";

const HIGHLIGHTS = [
  {
    icon: BarChart3,
    title: "NGX stock trading",
    description: "Buy and sell Nigerian Exchange-listed equities in real time.",
  },
  {
    icon: Layers,
    title: "Staking rewards",
    description: "Earn yield on your holdings with competitive APY.",
  },
  {
    icon: Shield,
    title: "Bank-grade security",
    description: "MFA, KYC verification, and encrypted sessions.",
  },
];

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden bg-dark text-white flex-col justify-between p-10 xl:p-14">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 20%, #4a6cf7 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #34d399 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(74,108,247,0.15)_0%,transparent_50%)]" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Raboovel Earn</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-primary/90 text-sm font-medium uppercase tracking-wider mb-3">
              Nigerian investing, simplified
            </p>
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
              Your NGX portfolio,
              <br />
              <span className="text-primary">one secure platform</span>
            </h2>
          </div>

          <ul className="space-y-5">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-white/60 mt-0.5">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          &copy; {new Date().getFullYear()} Raboovel Earn. All rights reserved.
        </p>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <header className="lg:hidden px-6 pt-8 pb-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">Raboovel Earn</span>
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-[420px] animate-fade-in">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-muted mt-2 text-sm sm:text-base">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
