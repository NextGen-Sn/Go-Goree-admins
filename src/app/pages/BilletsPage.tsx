import { Btn, Card, PageHeader, SearchBar, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Ticket, FileText, BarChart2, Database, Printer, Eye, Download } from "lucide-react";
import { useVoyages } from "@/app/hooks/voyages/useVoyages";
import { useBillets } from "@/app/hooks/billets/useBillets";

export default function BilletsPage({ sub }: { sub: string }) {
  const { data: voyages = [], isLoading: vLoading, isError: vError } = useVoyages();
  const { data: billets = [], isLoading: bLoading, isError: bError } = useBillets();
  const isLoading = vLoading || bLoading;
  const isError = vError || bError;
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

  if (sub === "export") {
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Export & Impression" subtitle="Exportez les billets dans le format souhaité" />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Filtres</h3>
            <div className="space-y-4">
              {[
                { label: "Période", options: ["Aujourd'hui", "7 derniers jours", "Ce mois"] },
                { label: "Voyage", options: ["Tous les voyages", ...voyages.map(v => `${v.id} (${v.depart})`)] },
                { label: "Catégorie", options: ["Toutes", "Touriste", "Résident", "Scolaire"] },
                { label: "Statut", options: ["Tous", "Validé", "En attente"] },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                  <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Format d'export</h3>
            <div className="space-y-3">
              {[
                { fmt: "PDF", desc: "Rapport complet avec liste des billets", icon: FileText, color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
                { fmt: "Excel (.xlsx)", desc: "Tableau avec tous les champs", icon: BarChart2, color: "text-green-600 bg-green-50 dark:bg-green-900/30" },
                { fmt: "CSV", desc: "Données brutes pour traitement", icon: Database, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30" },
                { fmt: "Impression", desc: "Impression directe de la liste", icon: Printer, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/30" },
              ].map(f => (
                <button key={f.fmt} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-all group text-left dark:bg-slate-800/50">
                  <div className={cn("size-10 rounded-lg flex items-center justify-center", f.color)}>
                    <f.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{f.fmt}</div>
                    <div className="text-xs text-slate-400">{f.desc}</div>
                  </div>
                  <Download size={15} className="text-slate-400 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Liste des billets" subtitle="Tous les billets émis — valables aller-retour"
        actions={<><Btn label="Imprimer" icon={Printer} variant="secondary" /><Btn label="Exporter" icon={Download} variant="secondary" /></>} />
      <div className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-xl border text-sm" style={{ background: "#EFF6FF", borderColor: "#BFDBFE", color: "#1D4ED8" }}>
        <Ticket size={16} />
        <span className="font-semibold">Chaque billet est valable pour l'aller et le retour (Dakar ↔ Gorée)</span>
      </div>
      <div className="flex gap-2 mb-4"><SearchBar placeholder="N° billet, nom passager..." /></div>
      <Card>
        <Table
          cols={["N° Billet", "Passager", "Voyage", "Catégorie", "Prix", "Paiement", "Validité", "Statut", ""]}
          rows={billets.map(b => [
            <span className="font-mono text-xs font-semibold" style={{ color: C.ocean }}>{b.id}</span>,
            b.passager, b.voyage,
            <Badge label={b.type} color={b.type === "Touriste" ? "blue" : b.type === "Résident" ? "teal" : "green"} />,
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{b.prix}</span>,
            b.methode,
            <Badge label={b.validite} color="indigo" />,
            <StatusBadge statut={b.statut} />,
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><Printer size={14} /></button>
            </div>,
          ])}
        />
      </Card>
    </div>
  );
}
