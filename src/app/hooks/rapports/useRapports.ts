import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listRapports, generateRapport } from "../../services/rapports/rapportsService";

export function useRapports() {
  return useQuery({
    queryKey: ["rapports"],
    queryFn: listRapports,
  });
}

export function useGenerateRapport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateRapport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapports"] });
    },
  });
}
