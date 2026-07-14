import { useQuery } from "@tanstack/react-query";
import { listVoyages } from "../services/voyagesService";
import { listTransactions } from "../services/paiementsService";
import { getDashboardMetrics } from "../services/analyticsService";
import {
  ticketData as mockTicketData,
  monthlyData as mockMonthlyData,
  pieData as mockPieData,
  voyages as mockVoyages,
  transactions as mockTransactions,
} from "../data/mock/dashboard.mock";

export interface DashboardData {
  ticketData: any;
  monthlyData: any;
  pieData: any;
  voyages: any;
  transactions: any;
}

export function useDashboard() {
  const voyagesQ = useQuery({
    queryKey: ["voyages"],
    queryFn: listVoyages,
    placeholderData: mockVoyages,
  });
  
  const transactionsQ = useQuery({
    queryKey: ["paiements", "transactions"],
    queryFn: listTransactions,
    placeholderData: mockTransactions,
  });
  
  const analyticsQ = useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: getDashboardMetrics,
    staleTime: 60000,
  });

  const isLoading =
    voyagesQ.isLoading ||
    transactionsQ.isLoading ||
    analyticsQ.isLoading;

  const isError =
    voyagesQ.isError ||
    transactionsQ.isError ||
    analyticsQ.isError;

  const metrics = analyticsQ.data || {};

  const data: DashboardData = {
    ticketData: metrics.weekly_distribution ?? mockTicketData,
    monthlyData: metrics.monthly_data ?? mockMonthlyData,
    pieData: metrics.visitor_categories ?? mockPieData,
    voyages: voyagesQ.data ?? mockVoyages,
    transactions: transactionsQ.data ?? mockTransactions,
  };

  return { ...data, isLoading, isError };
}
