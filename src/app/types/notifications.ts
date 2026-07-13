export type NotificationCanal = "SMS" | "Email" | "Push" | "In-App";
export type NotificationStatut = "Envoyé" | "Échoué" | "En attente" | "Brouillon";

export interface Notification {
  id: string;
  titre: string;
  message: string;
  canal: NotificationCanal;
  destinataires: number;
  statut: NotificationStatut;
  dateEnvoi?: string;
}
