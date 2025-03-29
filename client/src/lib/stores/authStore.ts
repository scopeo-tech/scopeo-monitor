import { create } from "zustand";
import { User } from "../interface";
import { logoutUser } from "../api";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await logoutUser();
      set({ user: null });
      console.log("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
