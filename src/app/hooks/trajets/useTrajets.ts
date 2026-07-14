import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listTrajets, 
  createTrajet, 
  updateTrajet, 
  deleteTrajet, 
  type Trajet 
} from "../../services/trajets/trajetsService";

export function useTrajets() {
  return useQuery({
    queryKey: ["trajets"],
    queryFn: listTrajets,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTrajet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Trajet, "id">) => createTrajet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trajets"] });
    },
  });
}

export function useUpdateTrajet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Trajet> }) => updateTrajet(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trajets"] });
    },
  });
}

export function useDeleteTrajet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTrajet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trajets"] });
    },
  });
}
