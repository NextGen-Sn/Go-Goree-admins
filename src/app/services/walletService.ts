import { laravelClient } from "../api/laravelClient";
import type { Mouvement } from "../types/wallet";

export interface SoldeWallet {
  soldeGlobal: number;
  walletsActifs: number;
  rechargementsMois: number;
}

export async function getSoldeWallet(): Promise<SoldeWallet> {
  const response = await laravelClient.get("/v1/analytics/transactions");
  return response.data.wallet_overview || { soldeGlobal: 4875000, walletsActifs: 1284, rechargementsMois: 312 };
}

export async function listMouvements(): Promise<Mouvement[]> {
  const response = await laravelClient.get("/v1/payements");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  
  return items.map((p: any) => {
    const isCredit = p.type_transaction === "recharge" || !p.billet_id;
    return {
      type: isCredit ? "credit" : "debit",
      libelle: isCredit ? `Rechargement ${p.mode || 'PayDunya'}` : "Achat billet",
      passager: p.user ? `${p.user.prenom} ${p.user.nom}` : "Client Inconnu",
      montant: isCredit ? `+${Number(p.montant).toLocaleString("fr-FR")}` : `-${Number(p.montant).toLocaleString("fr-FR")}`,
      date: p.created_at ? new Date(p.created_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      }) : "",
    };
  });
}

export async function listRechargements(): Promise<Mouvement[]> {
  const list = await listMouvements();
  return list.filter((m) => m.type === "credit");
}

export async function listDebits(): Promise<Mouvement[]> {
  const list = await listMouvements();
  return list.filter((m) => m.type === "debit");
}
