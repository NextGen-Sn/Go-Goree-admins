import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listControleurs, 
  createControleur, 
  updateControleur, 
  deleteControleur,
  resendControleurInvitation
} from "../../services/controleurs/controleursService";
import type { Controleur } from "../../types/controleurs";

export function useControleurs() {
  return useQuery({
    queryKey: ["controleurs"],
    queryFn: listControleurs,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateControleur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { nom: string; email: string; tel: string }) => createControleur(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["controleurs"] });
    },
  });
}

export function useUpdateControleur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Controleur> }) => updateControleur(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["controleurs"] });
    },
  });
}

export function useDeleteControleur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteControleur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["controleurs"] });
    },
  });
}

export function useResendControleurInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resendControleurInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["controleurs"] });
    },
  });
}
