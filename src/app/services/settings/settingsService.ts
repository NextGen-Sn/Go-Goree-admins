import { laravelClient } from "../../api/laravelClient";

export async function getSettings(): Promise<Record<string, any>> {
  const response = await laravelClient.get("/v1/settings");
  return response.data || {};
}

export async function updateSettings(payload: Record<string, any>): Promise<Record<string, any>> {
  const response = await laravelClient.put("/v1/settings", payload);
  return response.data || {};
}

export async function listActivityLogs(): Promise<any> {
  const response = await laravelClient.get("/v1/logs");
  return response.data || { data: [] };
}

export async function listTokens(): Promise<any[]> {
  const response = await laravelClient.get("/v1/tokens");
  return Array.isArray(response.data) ? response.data : [];
}

export async function createToken(name: string): Promise<any> {
  const response = await laravelClient.post("/v1/tokens", { name });
  return response.data;
}

export async function deleteToken(id: string | number): Promise<void> {
  await laravelClient.delete(`/v1/tokens/${id}`);
}
