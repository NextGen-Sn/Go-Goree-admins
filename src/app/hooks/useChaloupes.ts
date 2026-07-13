import { useQuery } from "@tanstack/react-query";
import {
  listChaloupes,
  getMaintenanceChaloupes,
  getPlanningChaloupes,
} from "../services/chaloupesService";
import { chaloupesData } from "../data/mock/dashboard.mock";

export function useChaloupes() {
  return useQuery({
    queryKey: ["chaloupes"],
    queryFn: listChaloupes,
    placeholderData: chaloupesData,
  });
}

export function useChaloupesMaintenance() {
  return useQuery({
    queryKey: ["chaloupes", "maintenance"],
    queryFn: getMaintenanceChaloupes,
    placeholderData: chaloupesData,
  });
}

export function useChaloupesPlanning() {
  return useQuery({
    queryKey: ["chaloupes", "planning"],
    queryFn: getPlanningChaloupes,
    placeholderData: chaloupesData,
  });
}
