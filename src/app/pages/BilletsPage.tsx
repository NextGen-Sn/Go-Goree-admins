import { useState } from "react";
import { Btn, Card, PageHeader, SearchBar, Table , Loader } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Ticket, FileText, BarChart2, Database, Printer, Eye, Download } from "lucide-react";
import { useVoyages } from "@/app/hooks/voyages/useVoyages";
import { useBillets } from "@/app/hooks/billets/useBillets";

const ROWS_PER_PAGE = 15;

export default function BilletsPage({ sub }: { sub: string }) {
  const { data: voyages = [], isLoading: vLoading, isError: vError } = useVoyages();
  const { data: billets = [], isLoading: bLoading, isError: bError } = useBillets();
  const isLoading = vLoading || bLoading;
  const isError = vError || bError;

  // ⚠️ Hook déclaré ici au top-level, AVANT tout return conditionnel
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(billets.length / ROWS_PER_PAGE));
  const paginated = billets.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);


  if (sub === "export") {
    return (
    <div className="p-6">
      <PageHeader title="Export & Impression" subtitle="Exportez les billets dans le format souhaité" />
      <Loader isLoading={isLoading} isError={isError} />
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
      <Loader isLoading={isLoading} isError={isError} />
      <PageHeader
        title="Liste des billets"
        subtitle={`${billets.length} billet${billets.length > 1 ? "s" : ""} au total — valables aller-retour`}
        actions={<><Btn label="Imprimer" icon={Printer} variant="secondary" /><Btn label="Exporter" icon={Download} variant="secondary" /></>}
      />
      <div className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-xl border text-sm" style={{ background: "#EFF6FF", borderColor: "#BFDBFE", color: "#1D4ED8" }}>
        <Ticket size={16} />
        <span className="font-semibold">Chaque billet est valable pour l'aller et le retour (Dakar ↔ Gorée)</span>
      </div>
      <div className="flex gap-2 mb-4"><SearchBar placeholder="N° billet, nom passager..." /></div>
      <Card>
        <Table
          cols={["N° Billet", "Passager", "Voyage", "Catégorie", "Prix", "Paiement", "Validité", "Statut", ""]}
          rows={paginated.map(b => [
            <span key={b.id} className="font-mono text-xs font-semibold" style={{ color: C.ocean }}>{b.id}</span>,
            b.passager, b.voyage,
            <Badge key={`cat-${b.id}`} label={b.type} color={b.type === "Touriste" ? "blue" : b.type === "Résident" ? "teal" : "green"} />,
            <span key={`px-${b.id}`} className="font-mono font-semibold text-slate-900 dark:text-slate-100">{b.prix}</span>,
            b.methode,
            <Badge key={`val-${b.id}`} label={b.validite} color="indigo" />,
            <StatusBadge key={`st-${b.id}`} statut={b.statut} />,
            <div key={`act-${b.id}`} className="flex gap-1">
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><Printer size={14} /></button>
            </div>,
          ])}
        />
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-400">
              {billets.length} billets • page {page} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >← Préc</button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >Suiv →</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
