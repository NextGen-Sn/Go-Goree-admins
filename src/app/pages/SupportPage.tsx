import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge } from "@/app/components/layout/common";
import { Eye, Plus, BellRing, FileText } from "lucide-react";

export default function SupportPage({ sub }: { sub: string }) {
  if (sub === "faq") {
    return (
      <div className="p-6">
        <PageHeader title="FAQ Administration" subtitle="Questions fréquentes et documentation"
          actions={<Btn label="Ajouter entrée" icon={Plus} variant="primary" />} />
        <div className="space-y-3">
          {[
            { q: "Comment examiner une demande de statut résident ?", r: "Accédez à Demandes Résident > En attente. Cliquez sur 'Examiner' pour accéder au dossier complet (CIN, certificat, photo). Vous pouvez valider ou refuser — un motif est obligatoire en cas de refus." },
            { q: "Comment modifier le statut d'une chaloupe ?", r: "Allez dans Chaloupes > Maintenance. Vous y trouverez la liste des chaloupes avec un sélecteur de statut (Actif, Maintenance, Inactif). Cliquez sur 'Sauvegarder les statuts' après modification." },
            { q: "Comment générer un rapport mensuel ?", r: "Rendez-vous dans Rapports > Générer un rapport. Sélectionnez le mois souhaité, le type et le format (PDF/Excel/CSV). Le rapport est prêt en quelques secondes." },
            { q: "Quelle est la politique de tarification de l'abonnement ?", r: "L'abonnement mensuel à 12 000 FCFA est réservé exclusivement aux résidents de l'Île de Gorée. Il leur permet de voyager sans limite pendant un mois calendaire." },
            { q: "Comment configurer un nouveau contrôleur ?", r: "Allez dans Contrôleurs > Liste. Cliquez sur 'Ajouter contrôleur', renseignez ses informations et affectez-le à une chaloupe et un shift. Son planning sera configuré dans l'onglet Planning." },
          ].map((item, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="size-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 shrink-0"
                  style={{ background: C.ocean }}>{i + 1}</div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{item.q}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.r}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Tickets Support" subtitle="Demandes d'assistance en cours"
        actions={<Btn label="Nouveau ticket" icon={Plus} variant="primary" />} />
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[ ["Ouverts", "5", C.amber], ["En cours", "3", C.ocean], ["Résolus (mois)", "28", C.green], ["Temps moyen", "2h14", C.teal] ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-3">
            <div className="text-2xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
            <div className="text-xs text-slate-500 mt-0.5">{l as string}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Table
          cols={["ID", "Sujet", "Soumis par", "Priorité", "Statut", ""]}
          rows={[
            ["TK-0891", "Paiement Wave non crédité", "Fatou Diallo", <Badge label="Haute" color="red" />, <StatusBadge statut="En cours" />, <Btn label="Voir" icon={Eye} variant="ghost" />],
            ["TK-0892", "Billet non scannable à l'embarquement", "Marc Dupont", <Badge label="Normale" color="amber" />, <StatusBadge statut="En attente" />, <Btn label="Voir" icon={Eye} variant="ghost" />],
            ["TK-0893", "Demande résidente non traitée", "Cheikh Mbaye", <Badge label="Normale" color="amber" />, <StatusBadge statut="En attente" />, <Btn label="Voir" icon={Eye} variant="ghost" />],
            ["TK-0894", "Problème connexion application", "Aminata Ndiaye", <Badge label="Faible" color="gray" />, <StatusBadge statut="En attente" />, <Btn label="Voir" icon={Eye} variant="ghost" />],
          ]}
        />
      </Card>
    </div>
  );
}
