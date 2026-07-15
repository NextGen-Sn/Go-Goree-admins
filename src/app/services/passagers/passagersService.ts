import { laravelClient } from "../../api/laravelClient";
import type { Passager } from "../../types/passagers";

function mapPassager(backendUser: any): Passager {
  const isResident = backendUser.est_resident || backendUser.role?.nom === "Resident" || false;
  const soldeValue = Number(backendUser.portefeuille?.solde ?? 0);

  return {
    id: backendUser.id,
    nom: `${backendUser.prenom} ${backendUser.nom}`.trim(),
    email: backendUser.email || "—",
    telephone: backendUser.telephone || "—",
    statut: isResident ? "Résident" : "Touriste",
    traversees: backendUser.traversees_count || 0,
    solde: `${soldeValue.toLocaleString("fr-FR")} FCFA`,
    soldeValue,
  };
}

export async function listPassagers(): Promise<Passager[]> {
  const response = await laravelClient.get("/v1/users");
  const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
  
  const passagerItems = items.filter((u: any) => u.role?.nom === "Client");
  
  if (passagerItems.length === 0) {
    return items.map(mapPassager);
  }
  
  return passagerItems.map(mapPassager);
}
