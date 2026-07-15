import { laravelClient } from "../../api/laravelClient";

export async function listRapports(): Promise<any> {
  const response = await laravelClient.get("/v1/rapports");
  return response.data || { data: [] };
}

export async function generateRapport(payload: { type: string; mois: string; format: string }): Promise<any> {
  const response = await laravelClient.post("/v1/rapports", payload);
  return response.data;
}

export function getDownloadUrl(id: string): string {
  // Returns download endpoint URL with authorization token or direct path
  const baseURL = laravelClient.defaults.baseURL || "";
  const token = localStorage.getItem("gg_admin_token") || "";
  return `${baseURL}/v1/rapports/${id}/telecharger?token=${token}`;
}
