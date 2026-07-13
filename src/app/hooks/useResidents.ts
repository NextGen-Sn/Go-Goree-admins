import { useQuery } from "@tanstack/react-query";
import {
  listDemandesResidents,
  listDemandesEnAttente,
  listDemandesRefusees,
  listDemandesHistorique,
} from "../services/residentsService";
import { demandesResidents } from "../data/mock/dashboard.mock";

export function useDemandesResidents() {
  return useQuery({
    queryKey: ["residents"],
    queryFn: listDemandesResidents,
    placeholderData: demandesResidents,
  });
}

export function useDemandesEnAttente() {
  return useQuery({
    queryKey: ["residents", "en-attente"],
    queryFn: listDemandesEnAttente,
    placeholderData: demandesResidents.filter((d) => d.statut === "En attente"),
  });
}

export function useDemandesRefusees() {
  return useQuery({
    queryKey: ["residents", "refusees"],
    queryFn: listDemandesRefusees,
    placeholderData: demandesResidents.filter((d) => d.statut === "Refusée"),
  });
}

export function useDemandesHistorique() {
  return useQuery({
    queryKey: ["residents", "historique"],
    queryFn: listDemandesHistorique,
    placeholderData: demandesResidents,
  });
}
