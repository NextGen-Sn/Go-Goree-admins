// TODO: Rebrancher quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { DemandeResident } from "../types/residents";
import { demandesResidents } from "../data/mock/dashboard.mock";

export async function listDemandesResidents(): Promise<DemandeResident[]> {
  return demandesResidents as DemandeResident[];
}

export async function listDemandesEnAttente(): Promise<DemandeResident[]> {
  return (demandesResidents as DemandeResident[]).filter((d) => d.statut === "En attente");
}

export async function listDemandesRefusees(): Promise<DemandeResident[]> {
  return (demandesResidents as DemandeResident[]).filter((d) => d.statut === "Refusée");
}

export async function listDemandesHistorique(): Promise<DemandeResident[]> {
  return demandesResidents as DemandeResident[];
}

export async function traiterDemande(
  id: string,
  statut: "validee" | "refusee",
  _motif?: string
): Promise<DemandeResident> {
  const found = (demandesResidents as DemandeResident[]).find((d) => d.id === id);
  return { ...found, statut } as DemandeResident;
}
