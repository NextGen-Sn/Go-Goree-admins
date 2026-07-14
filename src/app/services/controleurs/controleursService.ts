import { laravelClient } from "../../api/laravelClient";
import type { Controleur } from "../../types/controleurs";

function mapControleur(backendUser: any): Controleur {
  return {
    id: backendUser.id,
    nom: `${backendUser.prenom} ${backendUser.nom}`,
    email: backendUser.email || "—",
    tel: backendUser.telephone || "—",
    shift: "Matin", // Default shift info
    chaloupe: "Beer", // Default chaloupe info
    statut: backendUser.active ? "Actif" : "Inactif",
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

export async function createControleur(payload: { nom: string; email: string; tel: string }): Promise<any> {
  // Split nom into prenom and nom
  const parts = payload.nom.trim().split(" ");
  const prenom = parts[0];
  const nom = parts.slice(1).join(" ") || "—";

  const response = await laravelClient.post("/v1/controleurs", {
    prenom,
    nom,
    email: payload.email,
    telephone: payload.tel,
  });
  return response.data;
}

export async function updateControleur(id: string, payload: Partial<Controleur>): Promise<void> {
  const backendPayload: any = {};
  if (payload.nom) {
    const parts = payload.nom.trim().split(" ");
    backendPayload.prenom = parts[0];
    backendPayload.nom = parts.slice(1).join(" ") || "—";
  }
  if (payload.email) backendPayload.email = payload.email;
  if (payload.tel) backendPayload.telephone = payload.tel;
  if (payload.statut) backendPayload.active = payload.statut === "Actif";

  await laravelClient.put(`/v1/users/${id}`, backendPayload);
}

export async function deleteControleur(id: string): Promise<void> {
  await laravelClient.delete(`/v1/users/${id}`);
}
