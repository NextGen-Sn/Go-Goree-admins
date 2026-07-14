import { laravelClient } from "../api/laravelClient";

export async function getDashboardMetrics(): Promise<any> {
  const response = await laravelClient.get("/v1/analytics/dashboard");
  return response.data;
}

export async function getTransactionMetrics(): Promise<any> {
  const response = await laravelClient.get("/v1/analytics/transactions");
  return response.data;
}
