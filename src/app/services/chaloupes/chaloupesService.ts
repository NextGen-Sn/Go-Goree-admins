import { laravelClient } from "../../api/laravelClient";
import type { Chaloupe } from "../../types/chaloupes";

// StatutChaloupeEnum backend : ACTIVE | EN_MAINTENANCE | PANNE ↔ libellés UI.
const STATUT_FROM_BACKEND: Record<string, string> = {
  ACTIVE: "Actif",
  EN_MAINTENANCE: "Maintenance",
  PANNE: "Inactif",
};
const STATUT_TO_BACKEND: Record<string, string> = {
  Actif: "ACTIVE",
  Maintenance: "EN_MAINTENANCE",
  Inactif: "PANNE",
};

function toBackendStatut(statut?: string): string | undefined {
  if (!statut) return undefined;
  return STATUT_TO_BACKEND[statut] ?? statut;
}

function toBackendPayload(payload: Partial<Chaloupe>): Record<string, any> {
  const out: Record<string, any> = { ...payload };
  if (payload.statut !== undefined) out.statut = toBackendStatut(payload.statut);
  return out;
}

function mapChaloupe(backendChaloupe: any): Chaloupe {
  const rawStatut = backendChaloupe.statut?.value || backendChaloupe.statut || "ACTIVE";
  return {
    id: backendChaloupe.id,
    nom: backendChaloupe.nom,
    imatriculation: backendChaloupe.imatriculation || "",
    capacite: Number(backendChaloupe.capacite),
    statut: STATUT_FROM_BACKEND[rawStatut] ?? rawStatut,
    voyagesAuj: backendChaloupe.voyages_count || 0,
    occupation: backendChaloupe.occupation_rate || 75,
  };
}

export async function listChaloupes(): Promise<Chaloupe[]> {
  const response = await laravelClient.get("/v1/chaloupes");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapChaloupe);
}

export async function getChaloupe(id: string): Promise<Chaloupe> {
  const response = await laravelClient.get(`/v1/chaloupes/${id}`);
  const item = response.data.data || response.data;
  return mapChaloupe(item);
}

export async function createChaloupe(payload: Omit<Chaloupe, "id">): Promise<Chaloupe> {
  const response = await laravelClient.post("/v1/chaloupes", toBackendPayload(payload));
  const item = response.data.data || response.data;
  return mapChaloupe(item);
}

export async function updateChaloupe(id: string, payload: Partial<Chaloupe>): Promise<Chaloupe> {
  const response = await laravelClient.put(`/v1/chaloupes/${id}`, toBackendPayload(payload));
  const item = response.data.data || response.data;
  return mapChaloupe(item);
}

export async function deleteChaloupe(id: string): Promise<void> {
  await laravelClient.delete(`/v1/chaloupes/${id}`);
}

export async function updateStatutChaloupe(id: string, statut: string): Promise<Chaloupe> {
  const response = await laravelClient.put(`/v1/chaloupes/${id}`, { statut: toBackendStatut(statut) });
  const item = response.data.data || response.data;
  return mapChaloupe(item);
}

export async function getMaintenanceChaloupes(): Promise<Chaloupe[]> {
  const list = await listChaloupes();
  return list.filter((c) => c.statut === "Maintenance");
}

export async function getPlanningChaloupes(): Promise<Chaloupe[]> {
  const list = await listChaloupes();
  return list.filter((c) => c.statut === "Actif");
}
