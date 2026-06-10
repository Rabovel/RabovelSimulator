"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Layers,
  Gift,
  ShieldCheck,
  LogOut,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const userNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/portfolio", label: "Portfolio", icon: LineChart },
  { href: "/staking", label: "Staking", icon: Layers },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/kyc", label: "KYC", icon: ShieldCheck },
];

const adminNav = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/kyc", label: "KYC Review", icon: UserCog },
];

function BrandLogo({ compact = false, admin = false }: { compact?: boolean; admin?: boolean }) {
  return (
    <Link href={admin ? "/admin/users" : "/dashboard"} className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <TrendingUp className="w-5 h-5 text-white" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="font-bold text-sm">Raboovel Earn</p>
          <p className="text-xs text-muted">{admin ? "Admin" : "NGX · Staking"}</p>
        </div>
      )}
    </Link>
  );
}

function NavLinks({ items, pathname }: { items: typeof userNav; pathname: string }) {
  return items.map((item) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted hover:text-foreground hover:bg-surface-hover"
        )}
      >
        <item.icon className="w-4 h-4" />
        {item.label}
      </Link>
    );
  });
}

export function MobileHeader() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="xl:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
      <BrandLogo compact admin={isAdmin} />
      <div className="flex items-center gap-2 min-w-0">
        <div className="text-right min-w-0 hidden sm:block">
          <p className="text-xs font-medium truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[10px] text-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          aria-label="Sign out"
          className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const nav = user?.role === "ADMIN" ? adminNav : userNav;

  return (
    <nav
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface safe-area-bottom"
      aria-label="Main navigation"
    >
      <ul className="flex items-stretch justify-around px-1 pt-1 pb-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="flex-1 min-w-0">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-center transition-colors",
                  active ? "text-primary" : "text-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5 shrink-0", active && "stroke-[2.5]")}
                />
                <span className="text-[10px] leading-tight font-medium truncate w-full">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="hidden xl:flex w-64 min-h-screen border-r border-border bg-surface flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <BrandLogo admin={isAdmin} />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {isAdmin ? (
          <>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Admin
            </p>
            <NavLinks items={adminNav} pathname={pathname} />
          </>
        ) : (
          <NavLinks items={userNav} pathname={pathname} />
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-danger hover:bg-danger/10 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
