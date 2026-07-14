import { laravelClient } from "../../api/laravelClient";
import type { Voyage } from "../../types/voyages";

function mapVoyage(backendVoyage: any): Voyage {
  const trajet = backendVoyage.trajet || {};
  const chaloupe = backendVoyage.chaloupe || {};
  const capacity = Number(backendVoyage.places || chaloupe.capacite || 100);
  const sold = capacity - Number(backendVoyage.places_restantes || 0);

  const isPast = new Date(backendVoyage.date_voyage) < new Date(new Date().toDateString());
  const statut = isPast ? "Terminé" : (sold > 0 ? "En cours" : "Prévu");

  const recette = `${(sold * 5000).toLocaleString("fr-FR")} FCFA`;

  return {
    id: backendVoyage.id,
    depart: trajet.depart || "Dakar",
    arrivee: trajet.arrivee || "Gorée",
    chaloupe: chaloupe.nom || "Joseph Ndiaye",
    places: capacity,
    vendus: sold,
    statut: statut,
    recette: recette,
  };
}

export async function listVoyages(): Promise<Voyage[]> {
  const response = await laravelClient.get("/v1/voyages");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapVoyage);
}

export async function getVoyage(id: string): Promise<Voyage> {
  const response = await laravelClient.get(`/v1/voyages/${id}`);
  const item = response.data.data || response.data;
  return mapVoyage(item);
}

export async function createVoyage(payload: Partial<Voyage>): Promise<Voyage> {
  // Map back to backend fields
  // payload.chaloupe will be mapped to chaloupe_id by matching name or ID
  const response = await laravelClient.post("/v1/voyages", payload);
  const item = response.data.data || response.data;
  return mapVoyage(item);
}

export async function updateVoyage(id: string, payload: Partial<Voyage>): Promise<Voyage> {
  const response = await laravelClient.put(`/v1/voyages/${id}`, payload);
  const item = response.data.data || response.data;
  return mapVoyage(item);
}

export async function deleteVoyage(id: string): Promise<void> {
  await laravelClient.delete(`/v1/voyages/${id}`);
}

export async function getVoyagesDuJour(): Promise<Voyage[]> {
  const list = await listVoyages();
  return list.filter((v) => v.statut === "En cours" || v.statut === "Prévu");
}

export async function getVoyagesHistorique(): Promise<Voyage[]> {
  const list = await listVoyages();
  return list.filter((v) => v.statut === "Terminé");
}

export async function genererVoyagesManuellement(): Promise<string> {
  const response = await laravelClient.post("/v1/voyages/generer");
  return response.data.message || "Génération réussie.";
}
