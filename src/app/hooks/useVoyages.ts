import { useQuery } from "@tanstack/react-query";
import { listVoyages, getVoyagesDuJour, getVoyagesHistorique } from "../services/voyagesService";
import { voyages } from "../data/mock/dashboard.mock";

export function useVoyages() {
  return useQuery({
    queryKey: ["voyages"],
    queryFn: listVoyages,
    placeholderData: voyages,
  });
}

export function useVoyagesDuJour() {
  return useQuery({
    queryKey: ["voyages", "du-jour"],
    queryFn: getVoyagesDuJour,
    placeholderData: voyages,
  });
}

export function useVoyagesHistorique() {
  return useQuery({
    queryKey: ["voyages", "historique"],
    queryFn: getVoyagesHistorique,
    placeholderData: voyages,
  });
}
