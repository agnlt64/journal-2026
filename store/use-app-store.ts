import { create } from "zustand";

interface AppState {
  isBlurred: boolean;
  toggleBlur: () => void;
  setBlur: (val: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isBlurred: false,
  toggleBlur: () => set((state) => ({ isBlurred: !state.isBlurred })),
  setBlur: (val) => set({ isBlurred: val }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
