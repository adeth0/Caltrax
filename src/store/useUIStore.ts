import { create } from "zustand";

interface UIState {
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
}

/**
 * Client-only UI state that doesn't belong in the server/DB layer —
 * starting with the mobile nav drawer. Add more slices here as
 * client-side-only concerns come up (e.g. active dashboard tab,
 * in-progress food-log draft) rather than creating a new store per
 * feature.
 */
export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
}));
