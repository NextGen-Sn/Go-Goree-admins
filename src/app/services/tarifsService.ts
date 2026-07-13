// TODO: Rebrancher quand le backend Laravel sera disponible.
// import { laravelClient } from "../api/laravelClient";
import type { TarifCategorie } from "../types/tarifs";
import { tarifsCategories } from "../data/mock/dashboard.mock";

export async function listCategoriesTarifs(): Promise<TarifCategorie[]> {
  return tarifsCategories as TarifCategorie[];
}

export async function listHorairesTarifs(): Promise<unknown[]> {
  return [
    { tranche: "07h – 10h", multiplicateur: 1.0, label: "Heure normale" },
    { tranche: "10h – 14h", multiplicateur: 0.9, label: "Heure creuse" },
    { tranche: "14h – 18h", multiplicateur: 1.0, label: "Heure normale" },
    { tranche: "18h – 20h", multiplicateur: 1.2, label: "Heure de pointe" },
  ];
}

export async function updateGrilleTarifs(payload: TarifCategorie[]): Promise<TarifCategorie[]> {
  return payload;
}
