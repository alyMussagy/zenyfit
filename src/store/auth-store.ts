import { create } from 'zustand';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (admin: AdminUser) => void;
  logout: () => void;
  checkSession: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  admin: null,
  isAuthenticated: false,

  login: (admin) => {
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenyfit-admin', JSON.stringify(admin));
    }
    set({ admin, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zenyfit-admin');
    }
    set({ admin: null, isAuthenticated: false });
  },

  checkSession: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('zenyfit-admin');
      if (stored) {
        try {
          const admin = JSON.parse(stored);
          set({ admin, isAuthenticated: true });
          return true;
        } catch {
          localStorage.removeItem('zenyfit-admin');
        }
      }
    }
    return false;
  },
}));