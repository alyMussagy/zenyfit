import { create } from 'zustand';

type AppView = 'store' | 'dashboard';

interface AppStore {
  view: AppView;
  setView: (view: AppView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  view: 'store',
  setView: (view) => set({ view }),
  selectedProductId: null,
  setSelectedProductId: (id) => set({ selectedProductId: id }),
}));