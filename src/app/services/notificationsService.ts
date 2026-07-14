import { laravelClient } from "../api/laravelClient";
import type { Notification } from "../types/notifications";

function mapNotification(backendItem: any): Notification {
  const canalLabel = backendItem.canal === "MAIL" ? "Email" : (backendItem.canal === "IN_APP" ? "In-App" : "SMS");
  return {
    id: backendItem.id,
    titre: backendItem.type === "ALERTE" ? "Alerte Administrative" : "Alerte de Paiement",
    message: `Message envoyé via le canal ${canalLabel}`,
    canal: canalLabel as any,
    destinataires: 1,
    statut: backendItem.lu_a ? "Envoyé" : "Envoyé", // simple status fallback for admin history view
    dateEnvoi: backendItem.created_at ? new Date(backendItem.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) : "",
  };
}

export async function listNotifications(): Promise<Notification[]> {
  const response = await laravelClient.get("/v1/notifications");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapNotification);
}

export async function envoyerNotification(payload: any): Promise<any> {
  const response = await laravelClient.post("/v1/notifications/broadcast", {
    titre: payload.titre || "Alerte Go Gorée",
    message: payload.message || payload.contenu || "",
    canaux: payload.canaux || [payload.canal || "In-App"],
    destinataires: payload.destinataires || "Tous les passagers",
  });
  return response.data;
}

export async function listSms(): Promise<Notification[]> {
  const list = await listNotifications();
  return list.filter((n) => n.canal === "SMS");
}

export async function listEmails(): Promise<Notification[]> {
  const list = await listNotifications();
  return list.filter((n) => n.canal === "Email");
}

export async function listPush(): Promise<Notification[]> {
  const list = await listNotifications();
  return list.filter((n) => n.canal === "Push" as any);
}

export async function listInApp(): Promise<Notification[]> {
  const list = await listNotifications();
  return list.filter((n) => n.canal === "In-App");
}

export async function getHistoriqueNotifications(): Promise<Notification[]> {
  return listNotifications();
}
