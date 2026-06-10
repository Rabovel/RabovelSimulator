import { create } from "zustand";
import { api, type User } from "@/lib/api";

const TOKEN_KEY = "rabovel_token";

let onLogout: (() => void) | null = null;

export function registerAuthLogoutHandler(handler: () => void) {
  onLogout = handler;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, mfaToken?: string) => Promise<User>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: true,

  login: async (email, password, mfaToken) => {
    const { user, token } = await api.login({ email, password, mfaToken });
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
    return user;
  },

  register: async (data) => {
    const { user, token } = await api.register(data);
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
    onLogout?.();
  },

  refreshUser: async () => {
    const { token } = get();
    if (!token) return;
    const { user } = await api.me(token);
    set({ user });
  },

  hydrate: async () => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      set({ loading: false });
      return;
    }
    try {
      const { user } = await api.me(stored);
      set({ token: stored, user, loading: false });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({ loading: false });
    }
  },
}));
