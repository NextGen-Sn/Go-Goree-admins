import { laravelClient } from "../api/laravelClient";
import type { Controleur } from "../types/controleurs";

function mapControleur(backendUser: any): Controleur {
  return {
    id: backendUser.id,
    nom: `${backendUser.prenom} ${backendUser.nom}`,
    email: backendUser.email || "—",
    statut: backendUser.active ? "Actif" : "Inactif",
    derniereActivite: "Aujourd'hui",
    scans: 154,
    scansValides: 148,
    alertes: 6,
  };
}

export async function listControleurs(): Promise<Controleur[]> {
  const response = await laravelClient.get("/v1/controleurs");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapControleur);
}

export async function getControleur(id: string): Promise<Controleur> {
  const list = await listControleurs();
  return list.find((c) => c.id === id) ?? list[0];
}

export async function getPlanningControleurs(): Promise<Controleur[]> {
  const list = await listControleurs();
  return list.filter((c) => c.statut === "Actif");
}

export async function createControleur(payload: { prenom: string; nom: string; email: string; telephone: string }): Promise<any> {
  const response = await laravelClient.post("/v1/controleurs", payload);
  return response.data;
}
