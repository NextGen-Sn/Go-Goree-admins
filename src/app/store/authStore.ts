import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setTokenGetter, setUnauthorizedHandler } from "../api/laravelClient";

import { laravelClient } from "../api/laravelClient";

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
      login: async (email, password) => {
        if (!email || !password) throw new Error("Champs manquants");
        
        const response = await laravelClient.post("/v1/login", {
          email: email,
          mot_de_passe: password,
        });
        
        const { access_token, user } = response.data;
        const normalizedRole = user.role?.nom === "Admin" ? "admin" : "agent";
        
        set({
          token: access_token,
          user: {
            id: user.id,
            nom: `${user.prenom} ${user.nom}`,
            email: user.email,
            role: normalizedRole,
          },
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
