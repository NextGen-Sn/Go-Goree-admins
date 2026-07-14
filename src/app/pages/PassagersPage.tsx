import { useState } from "react";
import { Card, PageHeader, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Phone, Mail, Calendar } from "lucide-react";
import { usePassagers } from "@/app/hooks/passagers/usePassagers";

export default function PassagersPage() {
  const { data: passagers = [], isLoading, isError } = usePassagers();
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
  const [selectedId, setSelectedId] = useState(passagers[3]?.id ?? "");
  const p = passagers.find(x => x.id === selectedId) ?? passagers[3];

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Profil passager" subtitle="Sélectionnez un passager pour afficher son profil" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {passagers.map(pas => (
          <button key={pas.id} onClick={() => setSelectedId(pas.id)}
            className={cn("p-4 rounded-xl border text-left transition-all", selectedId === pas.id ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: C.sidebarActive }}>{pas.nom[0]}</div>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{pas.nom}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">{pas.id}</div>
              </div>
            </div>
            <StatusBadge statut={pas.statut} />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="flex flex-col items-center py-8">
          <div className="size-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
            style={{ background: C.sidebarActive }}>
            {p.nom.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">{p.nom}</h2>
          <div className="mb-3">
            <Badge label={p.type} color={p.type === "Touriste" ? "blue" : p.type === "Résident" ? "teal" : "green"} />
            {p.statut === "VIP" && <span className="ml-1"><Badge label="VIP" color="purple" /></span>}
          </div>
          <div className="w-full space-y-2 text-xs text-slate-600">
            {[[Phone, p.tel], [Mail, p.email], [Calendar, "Client depuis Jan 2023"]].map(([I, v], i) => (
              <div key={i} className="flex items-center gap-2">
                <I size={13} className="text-slate-400 shrink-0" />
                <span>{v as string}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center py-5">
              <div className="text-2xl font-bold font-mono mb-1" style={{ color: C.ocean }}>{p.voyages}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Voyages totaux</div>
            </Card>
            <Card className="text-center py-5">
              <div className="text-xl font-bold font-mono mb-1" style={{ color: C.teal }}>{p.solde}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Solde wallet</div>
            </Card>
            <Card className="text-center py-5">
              <div className="text-2xl font-bold font-mono mb-1" style={{ color: C.green }}>4.9★</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Note passager</div>
            </Card>
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Derniers voyages</h3>
            <Table
              cols={["Date", "Voyage", "Direction", "Statut"]}
              rows={[
                ["11 Jul 2026", "VY-2024-004 (13:00)", "Dakar → Gorée", <StatusBadge statut="Validé" />],
                ["10 Jul 2026", "VY-2024-001 (07:00)", "Gorée → Dakar", <StatusBadge statut="Validé" />],
                ["09 Jul 2026", "VY-2024-006 (17:00)", "Dakar → Gorée", <StatusBadge statut="Validé" />],
                ["08 Jul 2026", "VY-2024-003 (11:00)", "Gorée → Dakar", <StatusBadge statut="Validé" />],
              ]}
            />
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Informations complémentaires</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["N° Passager", p.id], ["Type", p.type],
                ["Téléphone", p.tel], ["Email", p.email],
                ["Statut", p.statut], ["Wallet", p.solde],
              ].map(([k, v]) => (
                <div key={k as string}><div className="text-xs text-slate-400 mb-0.5">{k as string}</div><div className="font-medium text-slate-800 dark:text-slate-200">{v}</div></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
