import { useQuery } from "@tanstack/react-query";
import { listVoyages } from "../services/voyagesService";
import { listTransactions } from "../services/paiementsService";
import {
  ticketData,
  monthlyData,
  pieData,
  voyages,
  transactions,
} from "../data/mock/dashboard.mock";

export interface DashboardData {
  ticketData: typeof ticketData;
  monthlyData: typeof monthlyData;
  pieData: typeof pieData;
  voyages: typeof voyages;
  transactions: typeof transactions;
}

export function useDashboard() {
  const voyagesQ = useQuery({
    queryKey: ["voyages"],
    queryFn: listVoyages,
    placeholderData: voyages,
  });
  const transactionsQ = useQuery({
    queryKey: ["paiements", "transactions"],
    queryFn: listTransactions,
    placeholderData: transactions,
  });
  const ticketQ = useQuery({
    queryKey: ["dashboard", "tickets"],
    queryFn: async () => ticketData,
    placeholderData: ticketData,
  });
  const monthlyQ = useQuery({
    queryKey: ["dashboard", "monthly"],
    queryFn: async () => monthlyData,
    placeholderData: monthlyData,
  });
  const pieQ = useQuery({
    queryKey: ["dashboard", "pie"],
    queryFn: async () => pieData,
    placeholderData: pieData,
  });

  const isLoading =
    voyagesQ.isLoading ||
    transactionsQ.isLoading ||
    ticketQ.isLoading ||
    monthlyQ.isLoading ||
    pieQ.isLoading;

  const isError =
    voyagesQ.isError ||
    transactionsQ.isError ||
    ticketQ.isError ||
    monthlyQ.isError ||
    pieQ.isError;

  const data: DashboardData = {
    ticketData: ticketQ.data ?? ticketData,
    monthlyData: monthlyQ.data ?? monthlyData,
    pieData: pieQ.data ?? pieData,
    voyages: voyagesQ.data ?? voyages,
    transactions: transactionsQ.data ?? transactions,
  };

  return { ...data, isLoading, isError };
}
