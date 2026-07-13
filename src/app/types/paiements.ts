export interface PaiementRepartition {
  name: string;
  value: number;
  color: string;
}

export interface Transaction {
  id: string;
  passager: string;
  montant: string;
  methode: string;
  statut: string;
  date: string;
}
