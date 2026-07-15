import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSettings,
  updateSettings,
  listActivityLogs,
  listTokens,
  createToken,
  deleteToken,
} from "../../services/settings/settingsService";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useActivityLogs() {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: listActivityLogs,
  });
}

export function useTokens() {
  return useQuery({
    queryKey: ["tokens"],
    queryFn: listTokens,
  });
}

export function useCreateToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
  });
}

export function useDeleteToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    },
  });
}
