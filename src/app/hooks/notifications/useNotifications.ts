import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listNotifications, broadcastNotification } from "../../services/notifications/notificationsService";
import type { BroadcastPayload } from "../../services/notifications/notificationsService";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    staleTime: 1000 * 60 * 2,
  });
}

export function useBroadcastNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BroadcastPayload) => broadcastNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
