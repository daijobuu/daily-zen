import { create } from 'zustand';
import { useUserStore } from './userStore';
import { useFavoritesStore } from './favoritesStore';
import { useUIStore } from './uiStore';

type Actions = {
  toggleFavorite: (quoteId: string) => void;
  onUpgrade: () => void;
};

export const useActions = create<Actions>(() => ({
  toggleFavorite: (quoteId) => {
    const user = useUserStore.getState();
    const fav = useFavoritesStore.getState();
    const ui = useUIStore.getState();

    if (!user._hydrated || !fav._hydrated) return;

    if (!user.isPremium) {
      ui.openPaywall(quoteId);
      return;
    }

    fav.has(quoteId) ? fav.remove(quoteId) : fav.add(quoteId);
  },

  onUpgrade: () => {
    const user = useUserStore.getState();
    const fav = useFavoritesStore.getState();
    const ui = useUIStore.getState();

    if (user.isPremium && ui.pendingQuoteId) {
      fav.add(ui.pendingQuoteId);
    }
    ui.closePaywall();
  },
}));
