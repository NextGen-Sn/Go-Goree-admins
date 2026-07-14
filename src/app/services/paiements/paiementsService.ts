import { laravelClient } from "../../api/laravelClient";

function mapPaiement(backendPayement: any): any {
  const methodVal = backendPayement.mode?.value || backendPayement.mode || "Wave";
  return {
    id: backendPayement.id,
    ref: backendPayement.reference,
    montant: `${Number(backendPayement.montant).toLocaleString("fr-FR")} FCFA`,
    mode: methodVal,
    methode: methodVal, // duplicate for compability
    date: backendPayement.created_at ? new Date(backendPayement.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }) : "—",
    statut: backendPayement.statut || "VALIDE",
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
