import { create } from "zustand";
import { User } from "../interface";
import { logoutUser } from "../api";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: JSON.parse(localStorage.getItem("user") || "null"), 
      setUser: (user) => {
        set({ user });
        localStorage.setItem("user", JSON.stringify(user));
      },
      logout: async () => {
        try {
          await logoutUser();
          set({ user: null });
          localStorage.removeItem("user"); 
          localStorage.removeItem("token");
          console.log("Logged out successfully!");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    {
      name: "auth-storage", 
    }
  )
);
