export interface Controleur {
  id: string;
  nom: string;
  tel: string;
  email: string;
  shift: string;
  chaloupe: string;
  statut: string;
  invitePending?: boolean;
  passwordResetAt?: string | null;
}
