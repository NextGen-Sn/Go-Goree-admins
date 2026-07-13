export interface Mouvement {
  type: "credit" | "debit";
  libelle: string;
  passager: string;
  montant: string;
  date: string;
}
