// TODO: Rebrancher quand le backend Go sera disponible.
// import { goClient } from "../api/goClient";
import type { Controleur } from "../types/controleurs";
import { controleurs } from "../data/mock/dashboard.mock";

export async function listControleurs(): Promise<Controleur[]> {
  return controleurs as Controleur[];
}

export async function getControleur(id: string): Promise<Controleur> {
  return (controleurs as Controleur[]).find((c) => c.id === id) ?? (controleurs[0] as Controleur);
}

export async function getPlanningControleurs(): Promise<Controleur[]> {
  return (controleurs as Controleur[]).filter((c) => c.statut === "Actif");
}
