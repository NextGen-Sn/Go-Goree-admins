import { useQuery } from "@tanstack/react-query";
import { listBillets } from "../../services/billets/billetsService";

export function useBillets() {
  return useQuery({
    queryKey: ["billets"],
    queryFn: listBillets,
  });
}
