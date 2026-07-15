export interface ResidentDocument {
  name: string;
  url: string;
}

export interface DemandeResident {
  id: string;
  nom: string;
  date: string;
  /** Basenames des pièces (compat) */
  docs: string[];
  /** Pièces avec URL complète (storage) */
  documents: ResidentDocument[];
  statut: string;
  cin: string;
  adresse: string;
  motif_refus: string | null;
}
