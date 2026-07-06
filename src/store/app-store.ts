import { create } from 'zustand';

type AppView = 'store' | 'dashboard';

interface AppStore {
  view: AppView;
  setView: (view: AppView) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  view: 'store',
  setView: (view) => set({ view }),
}));