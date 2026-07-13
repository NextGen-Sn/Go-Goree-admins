import { useQuery } from "@tanstack/react-query";
import {
  listNotifications,
  listSms,
  listEmails,
  listPush,
  listInApp,
  getHistoriqueNotifications,
} from "../services/notificationsService";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    placeholderData: [],
  });
}

export function useNotificationsSms() {
  return useQuery({
    queryKey: ["notifications", "sms"],
    queryFn: listSms,
    placeholderData: [],
  });
}

export function useNotificationsEmails() {
  return useQuery({
    queryKey: ["notifications", "email"],
    queryFn: listEmails,
    placeholderData: [],
  });
}

export function useNotificationsPush() {
  return useQuery({
    queryKey: ["notifications", "push"],
    queryFn: listPush,
    placeholderData: [],
  });
}

export function useNotificationsInApp() {
  return useQuery({
    queryKey: ["notifications", "in-app"],
    queryFn: listInApp,
    placeholderData: [],
  });
}

export function useNotificationsHistorique() {
  return useQuery({
    queryKey: ["notifications", "historique"],
    queryFn: getHistoriqueNotifications,
    placeholderData: [],
  });
}
