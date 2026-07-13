import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setTokenGetter, setUnauthorizedHandler } from "../api/laravelClient";

// TODO: Rebrancher l'appel réel quand le backend Laravel /auth/login sera disponible.
// import { laravelClient } from "../api/laravelClient";

export interface AuthUser {
  id?: string;
  nom?: string;
  email?: string;
  role?: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      // DEMO MODE — l'appel API Laravel est désactivé, connexion mock locale.
      // À remplacer par : await laravelClient.post("/auth/login", { email, password })
      login: async (email, password) => {
        if (!email || !password) throw new Error("Champs manquants");
        // Simuler un léger délai réseau pour un rendu réaliste
        await new Promise((r) => setTimeout(r, 600));
        set({
          token: "demo-mock-token",
          user: { id: "demo-1", nom: "Admin Démo", email, role: "admin" },
          isLoggedIn: true,
        });
      },
      logout: () => {
        set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    { name: "gg-auth" }
  )
);

setTokenGetter(() => useAuthStore.getState().token);
setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});
