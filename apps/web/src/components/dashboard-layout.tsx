"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar, BottomNav, MobileHeader } from "./sidebar";

const ADMIN_PREFIX = "/admin";
const USER_HOME = "/dashboard";
const ADMIN_HOME = "/admin/users";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;

    const isAdmin = user.role === "ADMIN";
    const onAdminRoute = pathname.startsWith(ADMIN_PREFIX);

    if (isAdmin && !onAdminRoute) {
      router.replace(ADMIN_HOME);
    } else if (!isAdmin && onAdminRoute) {
      router.replace(USER_HOME);
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const onAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  if ((isAdmin && !onAdminRoute) || (!isAdmin && onAdminRoute)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col xl:flex-row">
      <MobileHeader />
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background p-4 pb-24 xl:p-8 xl:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
