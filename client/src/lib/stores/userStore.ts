import { create } from "zustand";
import { userDetails } from "../interface"; 
import { logoutUser } from "../api";

// Define the state type
interface UserState {
  user: userDetails | null;
  setUser: (user: userDetails | null) => void;
  logout: () => Promise<void>;
}

// Create Zustand store
export const useUserStore = create<UserState>((set) => ({
  user: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null,

  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  logout: async () => {
    try {
      await logoutUser();
      set({ user: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
