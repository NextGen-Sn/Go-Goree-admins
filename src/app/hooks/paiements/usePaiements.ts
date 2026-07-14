import { useQuery } from "@tanstack/react-query";
import { listPaiements, getPaiementsRecommence } from "../../services/paiements/paiementsService";

export function usePaiements() {
  return useQuery({
    queryKey: ["paiements"],
    queryFn: listPaiements,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePaiementsRecommence() {
  return useQuery({
    queryKey: ["paiements", "recommence"],
    queryFn: getPaiementsRecommence,
    staleTime: 1000 * 60 * 5,
  });
}
