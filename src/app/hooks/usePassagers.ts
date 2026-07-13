import { useQuery } from "@tanstack/react-query";
import { listPassagers } from "../services/passagersService";
import { passagers } from "../data/mock/dashboard.mock";

export function usePassagers() {
  return useQuery({
    queryKey: ["passagers"],
    queryFn: listPassagers,
    placeholderData: passagers,
  });
}
