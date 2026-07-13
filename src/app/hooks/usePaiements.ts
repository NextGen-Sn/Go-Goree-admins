import { useQuery } from "@tanstack/react-query";
import { listTransactions, getRepartitionPaiements } from "../services/paiementsService";
import { transactions, paiementData, monthlyData } from "../data/mock/dashboard.mock";

export function useTransactions() {
  return useQuery({
    queryKey: ["paiements", "transactions"],
    queryFn: listTransactions,
    placeholderData: transactions,
  });
}

export function useRepartitionPaiements() {
  return useQuery({
    queryKey: ["paiements", "repartition"],
    queryFn: getRepartitionPaiements,
    placeholderData: paiementData,
  });
}

export function usePaiementsMonthly() {
  return useQuery({
    queryKey: ["paiements", "monthly"],
    queryFn: async () => monthlyData,
    placeholderData: monthlyData,
  });
}
