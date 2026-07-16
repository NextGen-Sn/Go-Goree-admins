export interface Controleur {
  id: string;
  nom: string;
  tel: string;
  email: string;
  statut: string;
  invitePending?: boolean;
  passwordResetAt?: string | null;
}
