// TODO: Rebrancher les appels réels quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { Transaction, PaiementRepartition } from "../types/paiements";
import { transactions, paiementData } from "../data/mock/dashboard.mock";

export async function listTransactions(): Promise<Transaction[]> {
  return transactions as Transaction[];
}

export async function getRepartitionPaiements(): Promise<PaiementRepartition[]> {
  return paiementData as PaiementRepartition[];
}

export async function listPaiementsMethode(
  methode: "wave" | "orange" | "yas" | "carte"
): Promise<Transaction[]> {
  // Filtre les transactions mock par méthode de paiement
  const methodMap: Record<string, string> = {
    wave: "Wave",
    orange: "Orange Money",
    yas: "Yas",
    carte: "Carte",
  };
  return (transactions as Transaction[]).filter(
    (t) => t.methode === methodMap[methode]
  );
}
