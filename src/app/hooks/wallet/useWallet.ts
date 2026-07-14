import { useQuery } from "@tanstack/react-query";
import { getWalletInfo, listWalletMovements, listWalletRechargements, listWalletDebits } from "../../services/wallet/walletService";

export function useWalletInfo() {
  return useQuery({
    queryKey: ["wallet", "info"],
    queryFn: getWalletInfo,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWalletMovements() {
  return useQuery({
    queryKey: ["wallet", "movements"],
    queryFn: listWalletMovements,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWalletRechargements() {
  return useQuery({
    queryKey: ["wallet", "rechargements"],
    queryFn: listWalletRechargements,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWalletDebits() {
  return useQuery({
    queryKey: ["wallet", "debits"],
    queryFn: listWalletDebits,
    staleTime: 1000 * 60 * 5,
  });
}
