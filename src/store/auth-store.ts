import { create } from "zustand";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar_url?: string;
  role?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (data: { user: User; token: string }) => void;
  logout: () => void;
  initAuthFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: ({ user, token }) => {
    set({ user, token });
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  initAuthFromStorage: () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      set({
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
      });
    }
  },
}));
