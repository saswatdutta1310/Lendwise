import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      jurisdiction: 'global',
      language: 'en',
      simpleMode: false,
      login: (data) => set({ ...data }),
      logout: () => set({ user: null, token: null, refreshToken: null, expiresAt: null }),
      setLanguage: (language) => set({ language }),
      setSimpleMode: (simpleMode) => set({ simpleMode }),
      setJurisdiction: (jurisdiction) => set({ jurisdiction }),
    }),
    {
      name: 'lendwise-auth-storage',
    }
  )
);
