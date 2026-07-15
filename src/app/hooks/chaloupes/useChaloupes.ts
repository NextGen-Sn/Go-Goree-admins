import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
useQueryClient;
import { 
  listChaloupes, 
  updateStatutChaloupe,
  createChaloupe,
  updateChaloupe,
  deleteChaloupe
} from "../../services/chaloupes/chaloupesService";

export function useChaloupes() {
  return useQuery({
    queryKey: ["chaloupes"],
    queryFn: listChaloupes,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateChaloupe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChaloupe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chaloupes"] });
    },
  });
}

export function useUpdateChaloupe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateChaloupe(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chaloupes"] });
    },
  });
}

export function useDeleteChaloupe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChaloupe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chaloupes"] });
    },
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
