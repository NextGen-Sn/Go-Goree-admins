export interface Mouvement {
  type: "credit" | "debit";
  libelle: string;
  passager: string;
  montant: string;
  date: string;
}

export interface WalletInfo {
  /** Solde global de tous les portefeuilles, formaté FCFA */
  soldeGlobal: string;
  /** Nombre de portefeuilles clients actifs */
  walletsActifs: number;
  /** Nombre de rechargements du mois (source: analytics backend) */
  rechargementsMois: number;
}
