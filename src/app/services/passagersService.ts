// TODO: Rebrancher quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { Passager } from "../types/passagers";
import { passagers } from "../data/mock/dashboard.mock";

export async function listPassagers(): Promise<Passager[]> {
  return passagers as Passager[];
}

export async function getPassager(id: string): Promise<Passager> {
  return (passagers as Passager[]).find((p) => p.id === id) ?? (passagers[0] as Passager);
}
