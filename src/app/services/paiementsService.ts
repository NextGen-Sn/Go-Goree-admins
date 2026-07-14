import { laravelClient } from "../api/laravelClient";
import type { Transaction, PaiementRepartition } from "../types/paiements";

function mapTransaction(backendPayement: any): Transaction {
  const user = backendPayement.user;
  const passengerName = user ? `${user.prenom} ${user.nom}` : "Client Inconnu";
  
  let mappedStatut = "En attente";
  if (backendPayement.statut === "ACCEPTE" || backendPayement.statut === "Succès") {
    mappedStatut = "Succès";
  } else if (backendPayement.statut === "REFUSE" || backendPayement.statut === "Échoué") {
    mappedStatut = "Échoué";
  }

  const formattedAmount = `${Number(backendPayement.montant).toLocaleString("fr-FR")} FCFA`;

  return {
    id: backendPayement.id || backendPayement.reference || "",
    passager: passengerName,
    montant: formattedAmount,
    methode: backendPayement.mode || "PayDunya",
    statut: mappedStatut,
    date: backendPayement.created_at ? new Date(backendPayement.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) : "",
  };
}

export async function listTransactions(): Promise<Transaction[]> {
  const response = await laravelClient.get("/v1/payements");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapTransaction);
}

export async function getRepartitionPaiements(): Promise<PaiementRepartition[]> {
  const response = await laravelClient.get("/v1/analytics/transactions");
  return response.data.payment_methods || [];
}

export async function listPaiementsMethode(
  methode: "wave" | "orange" | "yas" | "carte"
): Promise<Transaction[]> {
  const list = await listTransactions();
  const methodMap: Record<string, string> = {
    wave: "Wave",
    orange: "Orange Money",
    yas: "Yas",
    carte: "Carte",
  };
  return list.filter((t) => t.methode.toLowerCase() === methodMap[methode]?.toLowerCase());
}
