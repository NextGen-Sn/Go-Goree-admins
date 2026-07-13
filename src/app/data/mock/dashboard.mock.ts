export const monthlyData = [
  { month: "Jan", billets: 7680, recettes: 38400000, occupation: 79 },
  { month: "Fév", billets: 6840, recettes: 34200000, occupation: 72 },
  { month: "Mar", billets: 8360, recettes: 41800000, occupation: 84 },
  { month: "Avr", billets: 7920, recettes: 39600000, occupation: 81 },
  { month: "Mai", billets: 9040, recettes: 45200000, occupation: 87 },
  { month: "Jun", billets: 10560, recettes: 52800000, occupation: 91 },
  { month: "Jul", billets: 12280, recettes: 61400000, occupation: 94 },
];

export const ticketData = [
  { day: "Lun", billets: 312 }, { day: "Mar", billets: 289 }, { day: "Mer", billets: 421 },
  { day: "Jeu", billets: 387 }, { day: "Ven", billets: 456 }, { day: "Sam", billets: 612 }, { day: "Dim", billets: 534 },
];

export const pieData = [
  { name: "Touristes", value: 48, color: "#1035A8" },
  { name: "Résidents", value: 28, color: "#0BA5C0" },
  { name: "Scolaires", value: 12, color: "#0E9F6E" },
  { name: "Groupes", value: 8, color: "#D97706" },
  { name: "Autres", value: 4, color: "#7C3AED" },
];

export const voyages = [
  { id: "VY-2024-001", depart: "07:00", arrivee: "07:20", chaloupe: "Boubacar Joseph Ndiaye", places: 450, vendus: 398, statut: "Terminé", recette: "1 990 000 FCFA" },
  { id: "VY-2024-002", depart: "09:00", arrivee: "09:20", chaloupe: "Coumba Castel", places: 350, vendus: 312, statut: "Terminé", recette: "1 560 000 FCFA" },
  { id: "VY-2024-003", depart: "11:00", arrivee: "11:20", chaloupe: "Augustin Elimane Ly", places: 150, vendus: 128, statut: "Terminé", recette: "640 000 FCFA" },
  { id: "VY-2024-004", depart: "13:00", arrivee: "13:20", chaloupe: "Boubacar Joseph Ndiaye", places: 450, vendus: 441, statut: "En cours", recette: "2 205 000 FCFA" },
  { id: "VY-2024-005", depart: "15:00", arrivee: "15:20", chaloupe: "Coumba Castel", places: 350, vendus: 89, statut: "Prévu", recette: "—" },
  { id: "VY-2024-006", depart: "17:00", arrivee: "17:20", chaloupe: "Augustin Elimane Ly", places: 150, vendus: 0, statut: "Prévu", recette: "—" },
];

export const passagers = [
  { id: "P-0891", nom: "Fatou Diallo", type: "Résident", voyages: 48, solde: "12 500 FCFA", statut: "Actif", tel: "+221 77 123 45 67", email: "f.diallo@email.sn" },
  { id: "P-0892", nom: "Marc Dupont", type: "Touriste", voyages: 2, solde: "0 FCFA", statut: "Actif", tel: "+33 6 12 34 56 78", email: "m.dupont@email.fr" },
  { id: "P-0893", nom: "Aminata Ndiaye", type: "Résident", voyages: 112, solde: "8 000 FCFA", statut: "Actif", tel: "+221 78 987 65 43", email: "a.ndiaye@email.sn" },
  { id: "P-0896", nom: "Ibrahima Ba", type: "Résident", voyages: 203, solde: "25 000 FCFA", statut: "VIP", tel: "+221 77 345 67 89", email: "i.ba@email.sn" },
];

export const transactions = [
  { id: "TX-8891", passager: "Fatou Diallo", montant: "5 000 FCFA", methode: "Wave", statut: "Succès", date: "11 Jul 2026, 08:42" },
  { id: "TX-8892", passager: "Marc Dupont", montant: "15 000 FCFA", methode: "Carte", statut: "Succès", date: "11 Jul 2026, 09:15" },
  { id: "TX-8893", passager: "Aminata Ndiaye", montant: "800 FCFA", methode: "Wallet", statut: "Succès", date: "11 Jul 2026, 09:47" },
  { id: "TX-8894", passager: "Groupe École 45", montant: "32 000 FCFA", methode: "Orange Money", statut: "En attente", date: "11 Jul 2026, 10:02" },
  { id: "TX-8895", passager: "Pierre Lefebvre", montant: "10 000 FCFA", methode: "Wave", statut: "Échoué", date: "11 Jul 2026, 10:18" },
  { id: "TX-8896", passager: "Ibrahima Ba", montant: "1 600 FCFA", methode: "Wallet", statut: "Succès", date: "11 Jul 2026, 10:33" },
];

export const chaloupesData = [
  { id: "CH-01", nom: "Boubacar Joseph Ndiaye", capacite: 450, annee: 2018, moteur: "4x 420 CV diesel", longueur: "45 m", statut: "Actif", prochaineMaint: "15 Août 2026", voyagesAuj: 4, occupation: 88 },
  { id: "CH-02", nom: "Coumba Castel", capacite: 350, annee: 2021, moteur: "3x 380 CV diesel", longueur: "38 m", statut: "Actif", prochaineMaint: "22 Sep 2026", voyagesAuj: 3, occupation: 75 },
  { id: "CH-03", nom: "Augustin Elimane Ly", capacite: 150, annee: 2015, moteur: "2x 315 CV diesel", longueur: "25 m", statut: "Maintenance", prochaineMaint: "En cours", voyagesAuj: 0, occupation: 0 },
];

export const dailyHistorique = [
  { jour: "05 Jul", voyages: 8, passagers: 2840, recettes: 14200000, occupation: 89 },
  { jour: "06 Jul", voyages: 9, passagers: 3150, recettes: 15750000, occupation: 92 },
  { jour: "07 Jul", voyages: 8, passagers: 2960, recettes: 14800000, occupation: 86 },
  { jour: "08 Jul", voyages: 8, passagers: 2720, recettes: 13600000, occupation: 80 },
  { jour: "09 Jul", voyages: 9, passagers: 3080, recettes: 15400000, occupation: 85 },
  { jour: "10 Jul", voyages: 9, passagers: 3380, recettes: 16900000, occupation: 93 },
  { jour: "11 Jul", voyages: 6, passagers: 1440, recettes: 7200000, occupation: 87 },
];

export const paiementData = [
  { name: "Wave", value: 42, color: "#1E3A8A" },
  { name: "Orange Money", value: 31, color: "#EA580C" },
  { name: "Carte", value: 16, color: "#1035A8" },
  { name: "Yas", value: 8, color: "#0BA5C0" },
  { name: "Wallet", value: 3, color: "#7C3AED" },
];

export const hourlyData = [
  { heure: "07h", passagers: 45 }, { heure: "08h", passagers: 98 }, { heure: "09h", passagers: 143 },
  { heure: "10h", passagers: 87 }, { heure: "11h", passagers: 72 }, { heure: "12h", passagers: 156 },
  { heure: "13h", passagers: 134 }, { heure: "14h", passagers: 89 }, { heure: "15h", passagers: 76 },
  { heure: "16h", passagers: 112 }, { heure: "17h", passagers: 168 }, { heure: "18h", passagers: 145 }, { heure: "19h", passagers: 63 },
];

export const demandesResidents = [
  { id: "DR-0234", nom: "Mame Diarra Faye", date: "10 Jul 2026", docs: ["CIN", "Certificat de résidence", "Photo"], statut: "En attente", cin: "SN-7654321", adresse: "Île de Gorée, Rue du Port" },
  { id: "DR-0235", nom: "Cheikh Mbaye", date: "10 Jul 2026", docs: ["CIN", "Photo"], statut: "Incomplet", cin: "SN-8765432", adresse: "Île de Gorée, Quartier Castors" },
  { id: "DR-0236", nom: "Ndèye Sarr", date: "09 Jul 2026", docs: ["CIN", "Certificat de résidence", "Photo"], statut: "En attente", cin: "SN-9876543", adresse: "Île de Gorée, Rue Saint-Germain" },
  { id: "DR-0237", nom: "Moussa Cissé", date: "09 Jul 2026", docs: ["CIN", "Certificat de résidence", "Photo"], statut: "En attente", cin: "SN-1234567", adresse: "Île de Gorée, Zone historique" },
  { id: "DR-0238", nom: "Sophie Bernard", date: "08 Jul 2026", docs: ["Passeport", "Certificat de résidence", "Photo"], statut: "En attente", cin: "FR-Z012345", adresse: "Île de Gorée, Villa Keur Sopi" },
];

export const controleurs = [
  { id: "CT-01", nom: "Oumar Fall", tel: "+221 77 456 78 90", email: "o.fall@gogoree.sn", shift: "Matin (06h-14h)", chaloupe: "Boubacar Joseph Ndiaye", statut: "Actif" },
  { id: "CT-02", nom: "Mariama Diop", tel: "+221 78 234 56 78", email: "m.diop@gogoree.sn", shift: "Après-midi (14h-22h)", chaloupe: "Coumba Castel", statut: "Actif" },
  { id: "CT-03", nom: "Aliou Ndong", tel: "+221 77 345 67 89", email: "a.ndong@gogoree.sn", shift: "Soir (18h-00h)", chaloupe: "Augustin Elimane Ly", statut: "Actif" },
  { id: "CT-04", nom: "Khadija Sarr", tel: "+221 76 456 78 90", email: "k.sarr@gogoree.sn", shift: "—", chaloupe: "—", statut: "Inactif" },
];

// ── Billets (ex BilletsPage) ─────────────────────────────────────────────────
export const billets = [
  { id: "BL-44201", passager: "Marc Dupont", voyage: "VY-2024-002 (09:00)", type: "Touriste", prix: "5 000 FCFA", methode: "Carte", validite: "Aller-Retour", statut: "Validé" },
  { id: "BL-44202", passager: "Fatou Diallo", voyage: "VY-2024-002 (09:00)", type: "Résident", prix: "800 FCFA", methode: "Wallet", validite: "Aller-Retour", statut: "Validé" },
  { id: "BL-44203", passager: "Jean Martin", voyage: "VY-2024-003 (11:00)", type: "Touriste", prix: "5 000 FCFA", methode: "Wave", validite: "Aller-Retour", statut: "Validé" },
  { id: "BL-44204", passager: "Rokhaya Seck", voyage: "VY-2024-003 (11:00)", type: "Scolaire", prix: "400 FCFA", methode: "Orange Money", validite: "Aller-Retour", statut: "En attente" },
  { id: "BL-44205", passager: "Ibrahima Ba", voyage: "VY-2024-004 (13:00)", type: "Résident", prix: "800 FCFA", methode: "Wallet", validite: "Aller-Retour", statut: "Validé" },
  { id: "BL-44206", passager: "Sophie Bernard", voyage: "VY-2024-005 (15:00)", type: "Touriste", prix: "5 000 FCFA", methode: "Wave", validite: "Aller-Retour", statut: "En attente" },
];

// ── Mouvements Wallet (ex WalletPage) ────────────────────────────────────────
export const mouvements = [
  { type: "credit", libelle: "Rechargement Wave", passager: "Ibrahima Ba", montant: "+15 000", date: "11 Jul, 09:12" },
  { type: "debit", libelle: "Achat billet aller-retour", passager: "Fatou Diallo", montant: "-1 600", date: "11 Jul, 09:47" },
  { type: "credit", libelle: "Rechargement carte", passager: "Aminata Ndiaye", montant: "+10 000", date: "11 Jul, 10:03" },
  { type: "debit", libelle: "Achat billet aller-retour", passager: "Ibrahima Ba", montant: "-800", date: "11 Jul, 10:33" },
  { type: "credit", libelle: "Rechargement Orange", passager: "Rokhaya Seck", montant: "+5 000", date: "11 Jul, 11:05" },
];

// ── Tarifs — catégories (ex TarifsPage) ──────────────────────────────────────
export const tarifsCategories = [
  { cat: "Adulte Touriste", tarif: "5 000", abonnement: null as string | null },
  { cat: "Adulte Résident", tarif: "800", abonnement: "12 000" as string | null },
  { cat: "Enfant (< 12 ans)", tarif: "2 500", abonnement: null as string | null },
  { cat: "Scolaire", tarif: "400", abonnement: null as string | null },
  { cat: "Groupe (≥ 10 pers)", tarif: "4 000", abonnement: null as string | null },
  { cat: "Vélo", tarif: "2 000", abonnement: null as string | null },
];
