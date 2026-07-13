// TODO: Rebrancher quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { Mouvement } from "../types/wallet";
import { mouvements } from "../data/mock/dashboard.mock";

export interface SoldeWallet {
  soldeGlobal: number;
  walletsActifs: number;
  rechargementsMois: number;
}

export async function getSoldeWallet(): Promise<SoldeWallet> {
  return { soldeGlobal: 4875000, walletsActifs: 1284, rechargementsMois: 312 };
}

export async function listMouvements(): Promise<Mouvement[]> {
  return mouvements as Mouvement[];
}

export async function listRechargements(): Promise<Mouvement[]> {
  return (mouvements as Mouvement[]).filter((m) => m.type === "credit");
}

export async function listDebits(): Promise<Mouvement[]> {
  return (mouvements as Mouvement[]).filter((m) => m.type === "debit");
}
