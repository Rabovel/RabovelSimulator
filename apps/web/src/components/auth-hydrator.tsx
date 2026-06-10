"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { registerAuthLogoutHandler, useAuthStore } from "@/stores/auth-store";

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    registerAuthLogoutHandler(() => queryClient.clear());
    hydrate();
  }, [queryClient, hydrate]);

  return children;
}
