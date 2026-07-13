import { useQuery } from "@tanstack/react-query";
import { listCategoriesTarifs, listHorairesTarifs } from "../services/tarifsService";
import { tarifsCategories } from "../data/mock/dashboard.mock";

export function useTarifsCategories() {
  return useQuery({
    queryKey: ["tarifs", "categories"],
    queryFn: listCategoriesTarifs,
    placeholderData: tarifsCategories,
  });
}

export function useTarifsHoraires() {
  return useQuery({
    queryKey: ["tarifs", "horaires"],
    queryFn: listHorairesTarifs,
    placeholderData: [],
  });
}
