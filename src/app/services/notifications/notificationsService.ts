import { laravelClient } from "../../api/laravelClient";
import type { NotificationItem } from "../../types/notifications";

function mapNotification(backendItem: any): NotificationItem {
  return {
    id: backendItem.id,
    canal: backendItem.canal || "IN_APP",
    type: backendItem.type || "—",
    lu: Boolean(backendItem.lu_a),
    date: backendItem.created_at
      ? new Date(backendItem.created_at).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
  };
}

export async function listNotifications(): Promise<NotificationItem[]> {
  const response = await laravelClient.get("/v1/notifications");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapNotification);
}

/** Clé de canal côté UI → valeur attendue par POST /broadcast (in:SMS,Email,Push,In-App) */
const CANAL_UI_TO_BACKEND: Record<string, string> = {
  IN_APP: "In-App",
  EMAIL: "Email",
  MAIL: "Email",
  SMS: "SMS",
  PUSH: "Push",
};

export interface BroadcastPayload {
  titre: string;
  message: string;
  /** clé UI : IN_APP | EMAIL | SMS | PUSH */
  canal: string;
  /** "Tous les passagers" | "Résidents uniquement" | "Touristes uniquement" | "Scolaires uniquement" */
  destinataires: string;
}

export async function broadcastNotification(payload: BroadcastPayload): Promise<any> {
  const response = await laravelClient.post("/v1/notifications/broadcast", {
    titre: payload.titre,
    message: payload.message,
    canaux: [CANAL_UI_TO_BACKEND[payload.canal] ?? payload.canal],
    destinataires: payload.destinataires,
  });
  return response.data;
}
