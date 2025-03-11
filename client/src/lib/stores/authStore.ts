import { User } from "../interface";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  setUser: (user) => {
    set({ user });
  },
}));

