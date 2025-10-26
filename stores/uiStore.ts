import { create } from 'zustand';

type UIState = {
  showPaywall: boolean;
  pendingQuoteId: string | null;
  openPaywall: (quoteId?: string) => void;
  closePaywall: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  showPaywall: false,
  pendingQuoteId: null,
  openPaywall: (quoteId) =>
    set({ showPaywall: true, pendingQuoteId: quoteId ?? null }),
  closePaywall: () => set({ showPaywall: false, pendingQuoteId: null }),
}));
