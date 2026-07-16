import { laravelClient } from "../../api/laravelClient";
import type { Controleur } from "../../types/controleurs";

function mapControleur(backendUser: any): Controleur {
  return {
    id: backendUser.id,
    nom: `${backendUser.prenom} ${backendUser.nom}`,
    email: backendUser.email || "—",
    tel: backendUser.telephone || "—",
    statut: backendUser.active ? "Actif" : "Inactif",
    invitePending: backendUser.invite_pending,
    passwordResetAt: backendUser.password_reset_at,
  };
}

export async function listControleurs(): Promise<Controleur[]> {
  const response = await laravelClient.get("/v1/controleurs");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapControleur);
}

export async function createControleur(payload: { nom: string; email: string; tel: string }): Promise<any> {
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
  if (payload.tel !== undefined) backendPayload.telephone = payload.tel;
  if (payload.statut) backendPayload.active = payload.statut === "Actif";

  await laravelClient.put(`/v1/users/${id}`, backendPayload);
}

export async function deleteControleur(id: string): Promise<void> {
  await laravelClient.delete(`/v1/users/${id}`);
}

export async function resendControleurInvitation(id: string): Promise<any> {
  const response = await laravelClient.post(`/v1/controleurs/${id}/renvoyer-invitation`);
  return response.data;
}
