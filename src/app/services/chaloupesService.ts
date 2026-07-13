// TODO: Rebrancher quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { Chaloupe } from "../types/chaloupes";
import { chaloupesData } from "../data/mock/dashboard.mock";

export async function listChaloupes(): Promise<Chaloupe[]> {
  return chaloupesData as Chaloupe[];
}

export async function getChaloupe(id: string): Promise<Chaloupe> {
  return (chaloupesData as Chaloupe[]).find((c) => c.id === id) ?? (chaloupesData[0] as Chaloupe);
}

export async function updateStatutChaloupe(id: string, statut: string): Promise<Chaloupe> {
  const found = (chaloupesData as Chaloupe[]).find((c) => c.id === id) ?? (chaloupesData[0] as Chaloupe);
  return { ...found, statut } as Chaloupe;
}

export async function getMaintenanceChaloupes(): Promise<Chaloupe[]> {
  return (chaloupesData as Chaloupe[]).filter((c) => c.statut === "Maintenance");
}

export async function getPlanningChaloupes(): Promise<Chaloupe[]> {
  return (chaloupesData as Chaloupe[]).filter((c) => c.statut === "Actif");
}
