import { useQuery } from "@tanstack/react-query";
import { listPassagers } from "../../services/passagers/passagersService";

export function usePassagers() {
  return useQuery({
    queryKey: ["passagers"],
    queryFn: listPassagers,
    staleTime: 1000 * 60 * 5,
  });
}
