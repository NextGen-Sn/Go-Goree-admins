import { laravelClient } from "../../api/laravelClient";
import type { WalletInfo } from "../../types/wallet";

export async function getWalletInfo(): Promise<WalletInfo> {
  const response = await laravelClient.get("/v1/analytics/dashboard");
  const metrics = response.data;
  return {
    soldeGlobal: `${Number(metrics.revenus_totaux || 0).toLocaleString("fr-FR")} FCFA`,
    soldePhysique: `${Number((metrics.revenus_totaux || 0) * 0.4).toLocaleString("fr-FR")} FCFA`,
    soldeVirtuel: `${Number((metrics.revenus_totaux || 0) * 0.6).toLocaleString("fr-FR")} FCFA`,
    pourcentagePhysique: 40,
    pourcentageVirtuel: 60,
  };
}

function mapWalletMovement(backendPayement: any): any {
  const isCredit = backendPayement.type_transaction === "RECHARGE_PORTEFEUILLE" || backendPayement.type_transaction === "recharge";
  
  return {
    id: backendPayement.id,
    ref: backendPayement.reference,
    type: isCredit ? "credit" : "debit",
    montant: `${isCredit ? "+" : "-"}${Number(backendPayement.montant).toLocaleString("fr-FR")} FCFA`,
    mode: backendPayement.mode?.value || backendPayement.mode || "Wave",
    date: backendPayement.created_at ? new Date(backendPayement.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }) : "—",
    statut: backendPayement.statut === "ACCEPTE" ? "Validé" : "En cours",
    libelle: isCredit ? "Rechargement Portefeuille" : "Achat Billet",
    passager: backendPayement.user ? `${backendPayement.user.prenom} ${backendPayement.user.nom}` : "Passager",
  };
}

export async function listWalletMovements(): Promise<any[]> {
  const response = await laravelClient.get("/v1/payements");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapWalletMovement);
}

export async function listWalletRechargements(): Promise<any[]> {
  const list = await listWalletMovements();
  return list.filter((m) => m.type === "credit");
}

export async function listWalletDebits(): Promise<any[]> {
  const list = await listWalletMovements();
  return list.filter((m) => m.type === "debit");
}
