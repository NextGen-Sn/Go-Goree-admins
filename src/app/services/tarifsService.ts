import { laravelClient } from "../api/laravelClient";
import type { TarifCategorie } from "../types/tarifs";

function mapTarifCategorie(backendTarif: any): TarifCategorie {
  let catLabel = backendTarif.categorie;
  if (backendTarif.categorie === "ETRANGER") catLabel = "Touriste";
  else if (backendTarif.categorie === "RESIDENT") catLabel = "Résident";
  else if (backendTarif.categorie === "ENFANT") catLabel = "Scolaire / Enfant";
  else if (backendTarif.categorie === "ADULTE") catLabel = "Adulte";

  return {
    id: backendTarif.id,
    categorie: catLabel,
    prix: `${Number(backendTarif.prix).toLocaleString("fr-FR")} FCFA`,
    validite: "Aller-retour",
  };
}

export async function listCategoriesTarifs(): Promise<TarifCategorie[]> {
  const response = await laravelClient.get("/v1/tarifs");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return items.map(mapTarifCategorie);
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
  for (const item of payload) {
    // Strip " FCFA" and formatting to convert back to float
    const numericPrix = Number(String(item.prix).replace(/[^0-9.-]+/g, ""));
    if (!isNaN(numericPrix)) {
      await laravelClient.put(`/v1/tarifs/${item.id}`, {
        prix: numericPrix,
      });
    }
  }
  return listCategoriesTarifs();
}
