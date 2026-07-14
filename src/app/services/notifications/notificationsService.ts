import { laravelClient } from "../../api/laravelClient";
import type { NotificationItem } from "../../types/notifications";

function mapNotification(backendItem: any): NotificationItem {
  return {
    id: backendItem.id,
    canal: backendItem.canal || "IN_APP",
    destinataires: "Tous les passagers",
    message: backendItem.message,
    statut: "Envoyé",
    date: backendItem.created_at ? new Date(backendItem.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }) : "—",
  };
}

export async function listNotifications(): Promise<NotificationItem[]> {
  const response = await laravelClient.get("/v1/notifications");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapNotification);
}

export async function broadcastNotification(payload: { canal: string; message: string }): Promise<any> {
  const response = await laravelClient.post("/v1/notifications/broadcast", {
    canal: payload.canal,
    message: payload.message,
  });
  return response.data;
}
