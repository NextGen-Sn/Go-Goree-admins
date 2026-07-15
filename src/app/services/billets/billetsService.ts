import { laravelClient } from "../../api/laravelClient";
import type { Billet } from "../../types/billets";

// CategorieEnum backend → libellé UI.
const CATEGORIE_LABEL: Record<string, string> = {
  ETRANGER: "Touriste",
  RESIDENT: "Résident",
  ENFANT: "Scolaire",
  ADULTE: "Adulte",
};

// StatutBilletEnum backend → libellé reconnu par StatusBadge.
const STATUT_LABEL: Record<string, string> = {
  PAYE: "Validé",
  UTILISE: "Terminé",
  EN_ATTENTE: "En attente",
  EXPIRE: "Inactif",
  ANNULE: "Refusé",
};

function mapBillet(b: any): Billet {
  const voyage = b.voyage ?? {};
  const chaloupe = voyage.chaloupe?.nom ?? "—";
  const heure = voyage.trajet?.heure_depart ? String(voyage.trajet.heure_depart).slice(0, 5) : "";
  const dateVoyage = voyage.date_voyage
    ? new Date(voyage.date_voyage).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
    : "";
  const categorie = b.tarif?.categorie ?? "";
  const rawStatut = b.statut?.value ?? b.statut ?? "EN_ATTENTE";

  return {
    id: b.id,
    passager: b.user ? `${b.user.prenom} ${b.user.nom}`.trim() : "—",
    voyage: `${chaloupe}${dateVoyage ? ` · ${dateVoyage}` : ""}${heure ? ` ${heure}` : ""}`,
    type: CATEGORIE_LABEL[categorie] ?? categorie ?? "—",
    prix: `${Number(b.montant ?? 0).toLocaleString("fr-FR")} FCFA`,
    methode: "—", // le moyen de paiement n'est pas porté par le billet (voir Paiements)
    validite: "Aller-retour", // règle métier : chaque billet est valable A/R
    statut: STATUT_LABEL[rawStatut] ?? rawStatut,
  };
}

export async function listBillets(): Promise<Billet[]> {
  const first = await laravelClient.get("/v1/billets");
  if (Array.isArray(first.data)) return first.data.map(mapBillet);

  const lastPage = Number(first.data?.last_page ?? 1);
  const all: any[] = [...(first.data?.data ?? [])];

  if (lastPage > 1) {
    const pages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, i) =>
        laravelClient.get("/v1/billets", { params: { page: i + 2 } })
      )
    );
    for (const p of pages) all.push(...(p.data?.data ?? []));
  }

  return all.map(mapBillet);
}

export async function getBillet(id: string): Promise<Billet> {
  const response = await laravelClient.get(`/v1/billets/${id}`);
  const item = response.data?.data ?? response.data;
  return mapBillet(item);
}
