import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesState = {
  ids: Set<string>;
  _hydrated: boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: new Set(),
      _hydrated: false,
      add: (id) => set((s) => ({ ids: new Set(s.ids).add(id) })),
      remove: (id) =>
        set((s) => {
          const next = new Set(s.ids);
          next.delete(id);
          return { ids: next };
        }),
      has: (id) => get().ids.has(id),
    }),
    {
      name: 'favorites-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ ids: Array.from(s.ids) }),
      merge: (persisted: any, current) => ({
        ...current,
        ids: new Set(persisted?.ids ?? []),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    },
  ),
);
