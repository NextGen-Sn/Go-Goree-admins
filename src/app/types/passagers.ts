export interface Passager {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  /** "Résident" | "Touriste" (dérivé de est_resident) */
  statut: string;
  /** Nombre de traversées (billets utilisés) */
  traversees: number;
  /** Solde du portefeuille, formaté FCFA */
  solde: string;
  /** Solde brut numérique (tri) */
  soldeValue: number;
}
