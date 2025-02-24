import {create } from "zustand";
import { Project } from "../interface";

interface UserProjectsState {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
  }
  
  export const useUserProjectsStore = create<UserProjectsState>((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects }),
  }));