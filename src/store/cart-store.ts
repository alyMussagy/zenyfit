import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  _hydrated: boolean;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  hydrate: () => void;
}

const CART_KEY = 'zenyfit-cart';

function saveToStorage(items: CartItem[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }
}

function loadFromStorage(): CartItem[] {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Corrupted data — start fresh
    }
  }
  return [];
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  _hydrated: false,

  hydrate: () => {
    const stored = loadFromStorage();
    set({ items: stored, _hydrated: true });
  },

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...state.items, { ...item, id: crypto.randomUUID(), quantity: 1 }];
      }
      saveToStorage(newItems);
      return { items: newItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      saveToStorage(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      saveToStorage(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveToStorage([]);
    set({ items: [] });
  },

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));