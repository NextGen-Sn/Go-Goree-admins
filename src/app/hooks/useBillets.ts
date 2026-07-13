import { useQuery } from "@tanstack/react-query";
import { listBillets } from "../services/billetsService";
import { billets } from "../data/mock/dashboard.mock";

export function useBillets() {
  return useQuery({
    queryKey: ["billets"],
    queryFn: listBillets,
    placeholderData: billets,
  });
}
