// TODO: Rebrancher quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { Notification } from "../types/notifications";

const mockNotifications: Notification[] = [
  { id: "N-001", type: "sms", destinataire: "Tous les passagers", contenu: "Traversée 09h00 confirmée.", date: "11 Jul 2026, 08:30", statut: "Envoyé" },
  { id: "N-002", type: "email", destinataire: "Résidents inscrits", contenu: "Mise à jour des tarifs résidents.", date: "10 Jul 2026, 14:00", statut: "Envoyé" },
  { id: "N-003", type: "push", destinataire: "App mobile", contenu: "Nouvelle traversée ajoutée à 17h.", date: "10 Jul 2026, 09:15", statut: "Envoyé" },
  { id: "N-004", type: "inapp", destinataire: "Contrôleurs", contenu: "Planning mis à jour pour demain.", date: "09 Jul 2026, 17:45", statut: "Envoyé" },
];

export async function listNotifications(): Promise<Notification[]> {
  return mockNotifications;
}

export async function envoyerNotification(payload: Partial<Notification>): Promise<Notification> {
  return { id: "N-NEW", statut: "Envoyé", ...payload } as Notification;
}

export async function listSms(): Promise<Notification[]> {
  return mockNotifications.filter((n) => n.type === "sms");
}

export async function listEmails(): Promise<Notification[]> {
  return mockNotifications.filter((n) => n.type === "email");
}

export async function listPush(): Promise<Notification[]> {
  return mockNotifications.filter((n) => n.type === "push");
}

export async function listInApp(): Promise<Notification[]> {
  return mockNotifications.filter((n) => n.type === "inapp");
}

export async function getHistoriqueNotifications(): Promise<Notification[]> {
  return mockNotifications;
}
