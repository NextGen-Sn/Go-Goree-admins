import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listCategoriesTarifs, 
  updateGrilleTarifs, 
  createTarif, 
  deleteTarif 
} from "../../services/tarifs/tarifsService";
import type { TarifCategorie } from "../../types/tarifs";

export function useTarifsCategories() {
  return useQuery({
    queryKey: ["tarifs"],
    queryFn: listCategoriesTarifs,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateGrilleTarifs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TarifCategorie[]) => updateGrilleTarifs(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarifs"] });
    },
  });
}

export function useCreateTarif() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { categorie: string; prix: number }) => createTarif(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarifs"] });
    },
  });
}

export function useDeleteTarif() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTarif(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarifs"] });
    },
  });
}
