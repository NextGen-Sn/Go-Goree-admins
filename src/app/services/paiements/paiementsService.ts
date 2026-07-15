import { laravelClient } from "../../api/laravelClient";

// StatutPayementEnum backend → libellés reconnus par StatusBadge.
const STATUT_LABEL: Record<string, string> = {
  ACCEPTE: "Validé",
  EN_COURS: "En cours",
  REFUSE: "Refusé",
  SUSPECT: "En attente",
};

function mapPaiement(backendPayement: any): any {
  const methodVal = backendPayement.mode?.value || backendPayement.mode || "—";
  const rawStatut = backendPayement.statut?.value || backendPayement.statut || "EN_COURS";
  return {
    id: backendPayement.id,
    ref: backendPayement.reference,
    montant: `${Number(backendPayement.montant).toLocaleString("fr-FR")} FCFA`,
    montantValue: Number(backendPayement.montant) || 0,
    mode: methodVal, // valeur brute enum (WAVE, ORANGE_MONEY, ...) pour agrégats
    methode: methodVal,
    date: backendPayement.created_at ? new Date(backendPayement.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }) : "—",
    statut: STATUT_LABEL[rawStatut] ?? rawStatut,
    passager: backendPayement.user ? `${backendPayement.user.prenom} ${backendPayement.user.nom}` : "Passager inconnu",
  };
}

export async function listPaiements(): Promise<any[]> {
  const response = await laravelClient.get("/v1/payements");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapPaiement);
}

export async function getPaiementsRecommence(): Promise<any[]> {
  const list = await listPaiements();
  return list.filter((p) => p.statut === "ACCEPTE");
}
