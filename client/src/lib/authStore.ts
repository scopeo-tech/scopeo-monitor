import { create } from "zustand";
import { User } from "./interface";
import { logoutUser } from "./api";


interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async() =>{
    await logoutUser()
    set({ user: null })
  }
}));
