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
export const userStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await logoutUser();
      set({ user: null });
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
