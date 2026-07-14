import type { Billet } from "../../types/billets";
import { billets } from "../../data/mock/dashboard.mock";

export async function listBillets(): Promise<Billet[]> {
  return billets as Billet[];
}

export async function getBillet(id: string): Promise<Billet> {
  return (billets as Billet[]).find((b) => b.id === id) ?? (billets[0] as Billet);
}

export async function createBillet(payload: Partial<Billet>): Promise<Billet> {
  return { ...billets[0], ...payload } as Billet;
}

export async function imprimerBillet(_id: string): Promise<void> {
  return;
}

export async function exportBillets(_format: "pdf" | "excel" | "csv"): Promise<void> {
  return;
}
