import { laravelClient } from "../../api/laravelClient";

export interface Trajet {
  id: string;
  jour: string;
  heure_depart: string;
  duree: number;
}

function mapTrajet(item: any): Trajet {
  return {
    id: item.id,
    jour: item.jour,
    heure_depart: String(item.heure_depart).slice(0, 5), // '07:30:00' -> '07:30'
    duree: Number(item.duree),
  };
}

export async function listTrajets(): Promise<Trajet[]> {
  // L'API backend pagine les trajets (15/page) : { current_page, last_page, data: [...] }.
  // On parcourt toutes les pages pour couvrir les 7 jours de la semaine.
  const first = await laravelClient.get("/v1/trajets");
  if (Array.isArray(first.data)) return first.data.map(mapTrajet);

  const lastPage = Number(first.data?.last_page ?? 1);
  const all: any[] = [...(first.data?.data ?? [])];

  if (lastPage > 1) {
    const pages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, i) =>
        laravelClient.get("/v1/trajets", { params: { page: i + 2 } })
      )
    );
    for (const p of pages) all.push(...(p.data?.data ?? []));
  }

  return all.map(mapTrajet);
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
