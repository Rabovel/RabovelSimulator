import Link from "next/link";
import { TrendingUp, Shield, Layers, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">Raboovel Earn</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
          <TrendingUp className="w-4 h-4" />
          Nigerian stocks · NGX · Staking
        </div>
        <h1 className="text-5xl font-bold leading-tight max-w-3xl mx-auto">
          Grow your NGX portfolio with{" "}
          <span className="text-primary">smart staking</span> rewards
        </h1>
        <p className="text-muted text-lg mt-6 max-w-2xl mx-auto">
          Trade Nigerian Exchange-listed stocks, stake holdings for yield, and
          track rewards — all in one secure platform built for Nigerian investors.
        </p>
        <div className="flex gap-4 justify-center mt-10">
          <Link href="/register">
            <Button size="lg">Create free account</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Sign in to dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: BarChart3,
            title: "NGX Stock Trading",
            desc: "Buy shares of Dangote, MTN, GTCO, Zenith Bank, and other NGX-listed equities.",
          },
          {
            icon: Layers,
            title: "Staking Yield",
            desc: "Stake your holdings at competitive APY and earn passive rewards.",
          },
          {
            icon: Shield,
            title: "Secure & Compliant",
            desc: "JWT auth, MFA support, KYC verification, and full audit logging.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-muted text-sm mt-2">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-dark text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Start Your Trading Journey Today</h2>
          <p className="text-body mt-4 max-w-xl mx-auto">
            Open an account to explore NGX stock trading, staking, and rewards —
            built for Nigerian investors.
          </p>
          <Link href="/register" className="inline-block mt-8">
            <Button size="lg">Create free account</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        Raboovel Earn &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
