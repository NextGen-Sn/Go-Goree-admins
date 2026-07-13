import React, { useState } from "react";
import { PageHeader, Btn, Card, Table, ChartCard, SearchBar, KPICard } from "@/app/components/ui/Shared";
import { Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Plus, Filter, CheckCircle, Edit, Download, Printer, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useVoyages } from "@/app/hooks/useVoyages";
import { useChaloupes } from "@/app/hooks/useChaloupes";

export default function VoyagesPage({ sub }: { sub?: string }) {
  const s = sub ?? "";
  const { data: voyages = [], isLoading: vLoading, isError: vError } = useVoyages();
  const { data: chaloupes = [], isLoading: cLoading, isError: cError } = useChaloupes();
  const isLoading = vLoading || cLoading;
  const isError = vError || cError;
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
  if (s === "creer" || s === "modifier") {
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title={s === "creer" ? "Créer un voyage" : "Modifier un voyage"} subtitle="Configurez les détails du voyage"
          actions={<><Btn label="Annuler" variant="secondary" /><Btn label="Enregistrer" icon={CheckCircle} variant="primary" /></>} />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Informations du voyage</h3>
            <div className="space-y-4">
              {[
                { label: "Chaloupe", type: "select", options: chaloupes.filter(c => c.statut === "Actif").map(c => c.nom) },
                { label: "Date du voyage", type: "date" },
                { label: "Heure de départ", type: "time", defaultValue: s === "modifier" ? "07:00" : "" },
                { label: "Durée estimée (min)", type: "number", placeholder: "20" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                  {f.type === "select" ? (
                    <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none">
                      {(f.options as string[]).map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={f.placeholder} defaultValue={f.defaultValue}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none" />
                  )}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Tarification</h3>
            <div className="space-y-4">
              {[
                { label: "Tarif touriste (FCFA)", placeholder: "5000" },
                { label: "Tarif résident (FCFA)", placeholder: "800" },
                { label: "Tarif scolaire (FCFA)", placeholder: "400" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (s === "planning") {
    const slots = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"];
    const days = ["Lun 07", "Mar 08", "Mer 09", "Jeu 10", "Ven 11", "Sam 12", "Dim 13"];
    const chColors: Record<string, string> = {
      "Boubacar J.N.": "#1035A8", "Coumba C.": "#0BA5C0", "Augustin E.L.": "#0E9F6E",
    };
    const grid: Record<string, string> = {
      "Lun 07-07:00": "Boubacar J.N.", "Lun 07-09:00": "Coumba C.", "Lun 07-13:00": "Augustin E.L.",
      "Mar 08-07:00": "Coumba C.", "Mar 08-11:00": "Boubacar J.N.",
      "Ven 11-07:00": "Boubacar J.N.", "Ven 11-09:00": "Coumba C.", "Ven 11-11:00": "Augustin E.L.",
      "Ven 11-13:00": "Boubacar J.N.", "Ven 11-15:00": "Coumba C.", "Ven 11-17:00": "Augustin E.L.",
      "Sam 12-07:00": "Coumba C.", "Sam 12-09:00": "Boubacar J.N.", "Sam 12-11:00": "Augustin E.L.",
      "Sam 12-13:00": "Coumba C.", "Sam 12-15:00": "Boubacar J.N.", "Sam 12-17:00": "Coumba C.",
    };
    return (
      <div className="p-6">
        <PageHeader title="Planning des voyages" subtitle="Semaine du 7 au 13 Juillet 2026"
          actions={<><Btn label="Semaine précédente" icon={ChevronLeft} variant="secondary" /><Btn label="Semaine suivante" variant="secondary" /></>} />
        <Card className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-400 font-medium w-16">Horaire</th>
                {days.map(d => <th key={d} className="p-2 text-center text-slate-600 font-semibold min-w-[110px]">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot} className="border-t border-slate-50">
                  <td className="p-2 font-mono text-slate-500 font-semibold">{slot}</td>
                  {days.map(d => {
                    const key = `${d}-${slot}`;
                    const occ = grid[key];
                    return (
                      <td key={d} className="p-1">
                        {occ ? (
                          <div className="rounded-lg p-1.5 text-center text-white text-[10px] font-semibold cursor-pointer hover:opacity-80"
                            style={{ background: chColors[occ] ?? "#1035A8" }}>
                            {occ}
                          </div>
                        ) : (
                          <div className="rounded-lg p-1.5 text-center text-slate-300 text-[10px] border border-dashed border-slate-200 cursor-pointer hover:border-blue-300 hover:text-blue-400 transition-colors">
                            + Ajouter
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (s === "historique") {
    return (
      <div className="p-6">
        <PageHeader title="Historique des voyages" subtitle="Données détaillées par jour et par mois"
          actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ["Total voyages", "1 247", "#1035A8"], ["Passagers transportés", "563 480", "#0BA5C0"],
            ["Recettes totales", "2,82 Milliards FCFA", "#0E9F6E"], ["Taux d'occupation moyen", "85.4%", "#D97706"],
          ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-5">
              <div className="text-xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{l as string}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <ChartCard title="Évolution mensuelle des billets" subtitle="2026 — par mois">
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">(graphique)</div>
          </ChartCard>
          <ChartCard title="Taux d'occupation mensuel" subtitle="%">
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">(graphique)</div>
          </ChartCard>
        </div>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Détail par jour — 7 derniers jours</h3>
          <Table
            cols={["Jour", "Voyages", "Passagers totaux", "Recettes", "Taux occupation moyen"]}
            rows={[
              ["05 Jul", 8, 2840, "14.2M", <div className="text-xs">89%</div>],
              ["06 Jul", 9, 3150, "15.7M", <div className="text-xs">92%</div>],
            ]}
          />
        </Card>
      </div>
    );
  }

  // Liste
  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Voyages" subtitle="Gestion de tous les voyages"
        actions={<><Btn label="Filtrer" icon={Filter} variant="secondary" /><Btn label="Nouveau voyage" icon={Plus} variant="primary" /></>} />
      <div className="flex gap-2 mb-4">
        <SearchBar placeholder="Rechercher un voyage..." />
        {["Tous", "Terminé", "En cours", "Prévu"].map(f => (
          <button key={f} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
            f === "Tous" ? "text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700")}
            style={f === "Tous" ? { background: "#1035A8" } : undefined}>
            {f}
          </button>
        ))}
      </div>
      <Card>
        <Table
          cols={["ID", "Départ", "Arrivée", "Chaloupe", "Places", "Vendus", "Occupation", "Statut", "Recette", ""]}
          rows={voyages.map(v => [
            <span className="font-mono text-xs text-slate-500">{v.id}</span>,
            <span className="font-mono font-bold text-slate-900">{v.depart}</span>,
            v.arrivee, v.chaloupe,
            <span className="font-mono">{v.places}</span>,
            <span className="font-mono">{v.vendus}</span>,
            <div className="min-w-[80px]">{Math.round((v.vendus / v.places) * 100)}%</div>,
            <StatusBadge statut={v.statut} />,
            <span className="font-mono text-xs">{v.recette}</span>,
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"><Edit size={14} /></button>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>,
          ])}
        />
      </Card>
    </div>
  );
}
