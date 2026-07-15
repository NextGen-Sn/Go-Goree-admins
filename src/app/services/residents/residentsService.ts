import { laravelClient } from "../../api/laravelClient";
import type { DemandeResident, ResidentDocument } from "../../types/residents";

// Base storage : dérivée de VITE_API_LARAVEL_URL (on retire le suffixe /api) — pas d'URL en dur.
const API_BASE = import.meta.env.VITE_API_LARAVEL_URL ?? "http://localhost:8000/api";
const STORAGE_BASE = `${API_BASE.replace(/\/api\/?$/, "")}/storage`;

function buildDocuments(backendItem: any): ResidentDocument[] {
  const fields: [string, string | null | undefined][] = [
    ["Photo", backendItem.photo],
    ["CNI recto", backendItem.cni_recto],
    ["CNI verso", backendItem.cni_verso],
    ["Certificat de résidence", backendItem.certificat_residence],
  ];
  return fields
    .filter(([, path]) => Boolean(path))
    .map(([name, path]) => ({ name, url: `${STORAGE_BASE}/${path}` }));
}

function mapDemandeResident(backendItem: any): DemandeResident {
  let mappedStatut = "En attente";
  if (backendItem.statut === "ACCEPTEE" || backendItem.statut === "Validé") {
    mappedStatut = "Validé";
  } else if (backendItem.statut === "REFUSEE" || backendItem.statut === "Refusé") {
    mappedStatut = "Refusé";
  } else if (backendItem.statut === "ANNULEE" || backendItem.statut === "Incomplet") {
    mappedStatut = "Incomplet";
  }

  return {
    id: backendItem.id,
    nom: backendItem.nom || "Passager inconnu",
    date: backendItem.created_at ? new Date(backendItem.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) : "—",
    docs: backendItem.docs || [],
    documents: buildDocuments(backendItem),
    statut: mappedStatut,
    cin: backendItem.carte_identite || "—",
    adresse: backendItem.residence || "—",
    motif_refus: backendItem.motif_refus ?? null,
  };
}

export async function listDemandesResidents(): Promise<DemandeResident[]> {
  const response = await laravelClient.get("/v1/demandes-residence");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapDemandeResident);
}

export async function listDemandesEnAttente(): Promise<DemandeResident[]> {
  const items = await listDemandesResidents();
  return items.filter((d) => d.statut === "En attente");
}

export async function listDemandesRefusees(): Promise<DemandeResident[]> {
  const items = await listDemandesResidents();
  return items.filter((d) => d.statut === "Refusé");
}

export async function listDemandesHistorique(): Promise<DemandeResident[]> {
  return listDemandesResidents();
}

export async function traiterDemande(
  id: string,
  statut: "validee" | "refusee",
  motif?: string
): Promise<DemandeResident> {
  let response;
  if (statut === "validee") {
    response = await laravelClient.post(`/v1/demandes-residence/${id}/valider`);
  } else {
    response = await laravelClient.post(`/v1/demandes-residence/${id}/refuser`, {
      motif_refus: motif || "Pièce non lisible",
    });
  }
  const item = response.data.demande || response.data;
  return mapDemandeResident(item);
}
