import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listChaloupes, updateStatutChaloupe } from "../../services/chaloupes/chaloupesService";

export function useChaloupes() {
  return useQuery({
    queryKey: ["chaloupes"],
    queryFn: listChaloupes,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateStatutChaloupe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: string }) => updateStatutChaloupe(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chaloupes"] });
    },
  });
}
