import { laravelClient } from "../../api/laravelClient";
import type { Chaloupe } from "../../types/chaloupes";

function mapChaloupe(backendChaloupe: any): Chaloupe {
  return {
    id: backendChaloupe.id,
    nom: backendChaloupe.nom,
    capacite: backendChaloupe.capacite,
    statut: backendChaloupe.statut?.value || backendChaloupe.statut || "Actif",
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

export async function updateStatutChaloupe(id: string, statut: string): Promise<Chaloupe> {
  const response = await laravelClient.put(`/v1/chaloupes/${id}`, { statut });
  const item = response.data.data || response.data;
  return mapChaloupe(item);
}

export async function getMaintenanceChaloupes(): Promise<Chaloupe[]> {
  const list = await listChaloupes();
  return list.filter((c) => c.statut === "Maintenance");
}

export async function getPlanningChaloupes(): Promise<Chaloupe[]> {
  const list = await listChaloupes();
  return list.filter((c) => c.statut === "Actif" || c.statut === "ACTIF");
}
