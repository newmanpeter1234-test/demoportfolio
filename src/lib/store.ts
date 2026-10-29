import { create } from "zustand";

type AppStore = {
  loaded: boolean;
  menuOpen: boolean;
  setLoaded: (loaded: boolean) => void;
  setMenuOpen: (menuOpen: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  loaded: false,
  menuOpen: false,
  setLoaded: (loaded) => set({ loaded }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
