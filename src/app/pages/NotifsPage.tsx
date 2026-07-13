import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { Smartphone, Mail, Bell, MessageSquare, Send, BellRing, Download } from "lucide-react";
import { useNotifications } from "@/app/hooks/useNotifications";

export default function NotifsPage({ sub }: { sub: string }) {
  const { isLoading, isError } = useNotifications();
  const feedback = (
    <div className="space-y-2 mb-4">
      {isError && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
          Données indisponibles — affichage des dernières données connues.
        </div>
      )}
      {isLoading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-slate-400" />
        </div>
      )}
    </div>
  );

  if (sub === "envoyer") {
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Envoyer une notification" subtitle="Communiquer avec les passagers" />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Composer le message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Canaux d'envoi</label>
                <div className="flex gap-2 flex-wrap">
                  {[ ["SMS", Smartphone], ["Email", Mail], ["Push", Bell], ["In-App", MessageSquare] ].map(([l, I]) => (
                    <label key={l as string} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:bg-slate-800 transition-all text-slate-700 dark:text-slate-300">
                      <input type="checkbox" className="accent-blue-600" defaultChecked />
                      <I size={13} className="text-slate-500" />
                      <span className="text-xs font-medium text-slate-700">{l as string}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Destinataires</label>
                <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none">
                  <option>Tous les passagers</option>
                  <option>Résidents uniquement</option>
                  <option>Touristes uniquement</option>
                  <option>Scolaires uniquement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Titre</label>
                <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none" placeholder="Ex: Information — Voyage 17h00" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Message</label>
                <textarea className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none resize-none" rows={5} placeholder="Rédigez votre message ici..." />
              </div>
              <Btn label="Envoyer la notification" icon={Send} variant="primary" />
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Modèles prédéfinis</h3>
            <div className="space-y-2">
              {[
                { titre: "Voyage annulé", desc: "Notification d'annulation avec information remboursement" },
                { titre: "Retard de traversée", desc: "Information de délai pour le prochain voyage" },
                { titre: "Promo résidents", desc: "Offre spéciale abonnement mensuel résidents" },
                { titre: "Rappel réservation", desc: "Rappel avant le départ du voyage" },
                { titre: "Bienvenue nouveau passager", desc: "Message d'accueil à l'inscription" },
              ].map((t, i) => (
                <button key={i} className="w-full flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-all text-left">
                  <BellRing size={16} className="mt-0.5 shrink-0" style={{ color: C.ocean }} />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.titre}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "historique") {
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Historique des notifications" subtitle="Toutes les communications envoyées"
          actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
        <Card>
          <Table
            cols={["Date", "Canal", "Destinataires", "Titre", "Taux ouverture", "Statut"]}
            rows={[
              ["11 Jul 2026", "SMS + Push", "834", "Bon voyage — Dakar↔Gorée", "—", <StatusBadge statut="Validé" />],
              ["10 Jul 2026", "Email", "215", "Rappel voyage 19h", "68%", <StatusBadge statut="Validé" />],
              ["09 Jul 2026", "Push + In-App", "142", "Promo abonnement résidents", "81%", <StatusBadge statut="Validé" />],
            ]}
          />
        </Card>
      </div>
    );
  }

  const labels: Record<string, string> = { sms: "SMS", email: "Email", push: "Notifications Push", inapp: "In-App" };
  return (
    <div className="p-6">
      {feedback}
      <PageHeader title={`Canal — ${labels[sub] ?? sub}`} subtitle="Statistiques et historique du mois" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[ ["Envoyés (mois)", "1 842", C.ocean], ["Délivrés", "1 798", C.teal], ["Taux d'ouverture", "73.2%", C.green], ["Échecs", "44", C.red] ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-4">
            <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
            <div className="text-xs text-slate-500 mt-1">{l as string}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Table
          cols={["Date", "Destinataires", "Titre", "Statut"]}
          rows={[
            ["11 Jul 2026", "834", "Bon voyage — Dakar↔Gorée", <StatusBadge statut="Validé" />],
            ["10 Jul 2026", "215", "Rappel voyage 19h", <StatusBadge statut="Validé" />],
          ]}
        />
      </Card>
    </div>
  );
}
