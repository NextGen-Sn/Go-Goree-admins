import { useQuery } from "@tanstack/react-query";
import { listControleurs, getPlanningControleurs } from "../services/controleursService";
import { controleurs } from "../data/mock/dashboard.mock";

export function useControleurs() {
  return useQuery({
    queryKey: ["controleurs"],
    queryFn: listControleurs,
    placeholderData: controleurs,
  });
}

export function usePlanningControleurs() {
  return useQuery({
    queryKey: ["controleurs", "planning"],
    queryFn: getPlanningControleurs,
    placeholderData: controleurs,
  });
}
