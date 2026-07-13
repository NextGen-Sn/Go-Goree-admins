import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { FileText, Download, Plus } from "lucide-react";

export default function RapportsPage({ sub }: { sub: string }) {
  if (sub === "generer") {
    return (
      <div className="p-6">
        <PageHeader title="Générer un rapport" subtitle="Créez des rapports personnalisés" />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Configuration</h3>
            <div className="space-y-4">
              {[
                { label: "Type de rapport", options: ["Synthèse mensuelle", "Rapport voyages", "Rapport financier", "Rapport passagers"] },
                { label: "Mois", options: ["Juillet 2026", "Juin 2026", "Mai 2026", "Avril 2026"] },
                { label: "Format", options: ["PDF", "Excel (.xlsx)", "CSV"] },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                  <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Sections à inclure</label>
                {[
                  "KPIs principaux", "Détail des voyages", "Transactions financières", "Statistiques passagers", "Graphiques",
                ].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mb-2">
                    <input type="checkbox" className="accent-blue-600" defaultChecked />
                    {s}
                  </label>
                ))}
              </div>
              <Btn label="Générer le rapport" icon={FileText} variant="primary" />
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Aperçu</h3>
            <div className="h-96 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex flex-col items-center justify-center">
              <FileText size={40} className="text-slate-200 mb-3" />
              <p className="text-sm font-medium text-slate-300">L'aperçu apparaîtra ici</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const fmtLabels: Record<string, string> = { pdf: "Rapports PDF", excel: "Rapports Excel", csv: "Rapports CSV" };
  if (sub === "pdf" || sub === "excel" || sub === "csv") {
    return (
      <div className="p-6">
        <PageHeader title={fmtLabels[sub]} subtitle="Rapports disponibles au téléchargement"
          actions={<Btn label="Nouveau rapport" icon={Plus} variant="primary" />} />
        <Card>
          <Table
            cols={["Nom du rapport", "Mois", "Taille", "Généré le", "Par", ""]}
            rows={[
              [
                `rapport_synthese_juillet2026.${sub}`,
                "Juillet 2026",
                "2.4 MB",
                "11 Jul, 20:00",
                "Auto",
                <Btn label="Télécharger" icon={Download} variant="secondary" />,
              ],
              [
                `rapport_financier_juin2026.${sub}`,
                "Juin 2026",
                "5.1 MB",
                "01 Jul, 00:05",
                "Admin",
                <Btn label="Télécharger" icon={Download} variant="secondary" />,
              ],
              [
                `rapport_passagers_mai2026.${sub}`,
                "Mai 2026",
                "3.8 MB",
                "01 Jun, 00:05",
                "Auto",
                <Btn label="Télécharger" icon={Download} variant="secondary" />,
              ],
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Historique des rapports" subtitle="Tous les rapports générés" actions={<Btn label="Générer" icon={Plus} variant="primary" />} />
      <Card>
        <Table
          cols={["Rapport", "Format", "Mois couvert", "Taille", "Date génération", ""]}
          rows={[
            ["Synthèse mensuelle", "PDF", "Juillet 2026", "2.4 MB", "11 Jul 2026", <Btn label="↓" variant="ghost" />],
            ["Rapport financier", "Excel", "Juin 2026", "5.1 MB", "01 Jul 2026", <Btn label="↓" variant="ghost" />],
            ["Rapport passagers", "PDF", "Mai 2026", "3.8 MB", "01 Jun 2026", <Btn label="↓" variant="ghost" />],
            ["Export transactions", "CSV", "Mai 2026", "1.2 MB", "01 Jun 2026", <Btn label="↓" variant="ghost" />],
          ]}
        />
      </Card>
    </div>
  );
}
