import { laravelClient } from "../../api/laravelClient";

export interface Trajet {
  id: string;
  jour: string;
  heure_depart: string;
  duree: number;
}

export async function listTrajets(): Promise<Trajet[]> {
  const response = await laravelClient.get("/v1/trajets");
  // L'API backend pagine les trajets : { current_page: 1, data: [...] }
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map((item: any) => ({
    id: item.id,
    jour: item.jour,
    heure_depart: String(item.heure_depart).slice(0, 5), // '07:30:00' -> '07:30'
    duree: Number(item.duree),
  }));
}

export async function createTrajet(payload: Omit<Trajet, "id">): Promise<Trajet> {
  const response = await laravelClient.post("/v1/trajets", payload);
  const item = response.data;
  return {
    id: item.id,
    jour: item.jour,
    heure_depart: String(item.heure_depart).slice(0, 5),
    duree: Number(item.duree),
  };
}

export async function updateTrajet(id: string, payload: Partial<Trajet>): Promise<Trajet> {
  const response = await laravelClient.put(`/v1/trajets/${id}`, payload);
  const item = response.data;
  return {
    id: item.id,
    jour: item.jour,
    heure_depart: String(item.heure_depart).slice(0, 5),
    duree: Number(item.duree),
  };
}

export async function deleteTrajet(id: string): Promise<void> {
  await laravelClient.delete(`/v1/trajets/${id}`);
}
