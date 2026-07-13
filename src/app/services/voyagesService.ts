// TODO: Rebrancher quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { Voyage } from "../types/voyages";
import { voyages } from "../data/mock/dashboard.mock";

export async function listVoyages(): Promise<Voyage[]> {
  return voyages as Voyage[];
}

export async function getVoyage(id: string): Promise<Voyage> {
  return (voyages as Voyage[]).find((v) => v.id === id) ?? (voyages[0] as Voyage);
}

export async function createVoyage(payload: Partial<Voyage>): Promise<Voyage> {
  return { ...voyages[0], ...payload } as Voyage;
}

export async function updateVoyage(id: string, payload: Partial<Voyage>): Promise<Voyage> {
  const found = (voyages as Voyage[]).find((v) => v.id === id) ?? (voyages[0] as Voyage);
  return { ...found, ...payload };
}

export async function deleteVoyage(_id: string): Promise<void> {
  return;
}

export async function getVoyagesDuJour(): Promise<Voyage[]> {
  return (voyages as Voyage[]).filter((v) => v.statut === "En cours" || v.statut === "Prévu");
}

export async function getVoyagesHistorique(): Promise<Voyage[]> {
  return (voyages as Voyage[]).filter((v) => v.statut === "Terminé");
}
