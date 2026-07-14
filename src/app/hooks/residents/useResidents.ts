import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listDemandesEnAttente, 
  listDemandesRefusees, 
  listDemandesHistorique, 
  traiterDemande 
} from "../../services/residents/residentsService";

export function useDemandesEnAttente() {
  return useQuery({
    queryKey: ["residents", "en-attente"],
    queryFn: listDemandesEnAttente,
    staleTime: 1000 * 60 * 2,
  });
}

export function useDemandesRefusees() {
  return useQuery({
    queryKey: ["residents", "refusees"],
    queryFn: listDemandesRefusees,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDemandesHistorique() {
  return useQuery({
    queryKey: ["residents", "historique"],
    queryFn: listDemandesHistorique,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTraiterDemande() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut, motif }: { id: string; statut: "validee" | "refusee"; motif?: string }) => 
      traiterDemande(id, statut, motif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      // Invalidate dashboard metrics as well
      queryClient.invalidateQueries({ queryKey: ["dashboard", "metrics"] });
    },
  });
}
