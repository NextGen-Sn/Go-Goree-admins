/** Canaux tels que stockés en base (CanalEnum backend) */
export type NotificationCanal = "SMS" | "IN_APP" | "MAIL";
/** Types tels que stockés en base (NotificationEnum backend) */
export type NotificationType = "PAYEMENT" | "ALERTE";

/**
 * Forme réellement renvoyée par GET /v1/notifications.
 * La table `notifications` ne stocke PAS de titre / message / destinataires :
 * on n'expose donc que les colonnes réelles (type, canal, statut lu/non lu, date).
 */
export interface NotificationItem {
  id: string;
  canal: NotificationCanal | string;
  type: NotificationType | string;
  lu: boolean;
  date: string;
}
