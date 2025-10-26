import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserState = {
  isPremium: boolean;
  _hydrated: boolean;
  setPremium: (v: boolean) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isPremium: false,
      _hydrated: false,
      setPremium: (v) => set({ isPremium: v }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    },
  ),
);
