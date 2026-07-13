import { useQuery } from "@tanstack/react-query";
import {
  getSoldeWallet,
  listMouvements,
  listRechargements,
  listDebits,
} from "../services/walletService";
import { mouvements } from "../data/mock/dashboard.mock";

const SOLDE_FALLBACK = {
  soldeGlobal: 0,
  walletsActifs: 342,
  rechargementsMois: 1800000,
};

export function useSoldeWallet() {
  return useQuery({
    queryKey: ["wallet", "solde"],
    queryFn: getSoldeWallet,
    placeholderData: SOLDE_FALLBACK,
  });
}

export function useMouvements() {
  return useQuery({
    queryKey: ["wallet", "mouvements"],
    queryFn: listMouvements,
    placeholderData: mouvements,
  });
}

export function useRechargements() {
  return useQuery({
    queryKey: ["wallet", "rechargements"],
    queryFn: listRechargements,
    placeholderData: mouvements,
  });
}

export function useDebits() {
  return useQuery({
    queryKey: ["wallet", "debits"],
    queryFn: listDebits,
    placeholderData: mouvements,
  });
}
