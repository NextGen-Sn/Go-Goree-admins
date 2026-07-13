import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Download, Filter, Eye, ArrowUpRight, ArrowDownRight, Database } from "lucide-react";
import { useMouvements } from "@/app/hooks/useWallet";
import { usePassagers } from "@/app/hooks/usePassagers";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function WalletPage({ sub }: { sub: string }) {
  const { data: mouvements = [], isLoading: mvtLoading, isError: mvtError } = useMouvements();
  const { data: passagers = [], isLoading: pLoading, isError: pError } = usePassagers();
  const isLoading = mvtLoading || pLoading;
  const isError = mvtError || pError;
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

  if (sub !== "solde") {
    const filtered = sub === "rechargements"
      ? mouvements.filter(m => m.type === "credit")
      : sub === "debits"
        ? mouvements.filter(m => m.type === "debit")
        : mouvements;
    const labels: Record<string, string> = {
      mouvements: "Mouvements wallet",
      rechargements: "Rechargements",
      debits: "Débits",
      exports: "Export wallet",
    };

    if (sub === "exports") {
      return (
        <div className="p-6">
          <PageHeader title="Export wallet" subtitle="Télécharger les données du portefeuille" />
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Paramètres d'export</h3>
              <div className="space-y-4">
                {[
                  { label: "Période", options: ["Ce mois", "Trimestre", "Année"] },
                  { label: "Type de mouvements", options: ["Tous", "Rechargements", "Débits"] },
                  { label: "Format", options: ["CSV", "Excel", "PDF"] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                    <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none">
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <Btn label="Générer l'export" icon={Download} variant="primary" />
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Exports récents</h3>
              <div className="space-y-2">
                {["wallet_juillet_2026.csv", "wallet_juin_2026.xlsx", "wallet_mai_2026.csv"].map(f => (
                  <div key={f} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Database size={14} className="text-slate-400" />
                      <span className="text-xs font-mono text-slate-700">{f}</span>
                    </div>
                    <button className="hover:text-blue-700" style={{ color: C.ocean }}><Download size={14} /></button>
                  </div>
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
        <PageHeader title={labels[sub] ?? sub} subtitle="Historique des opérations wallet"
          actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
        <Card>
          <Table
            cols={["Type", "Libellé", "Passager", "Montant (FCFA)", "Date"]}
            rows={filtered.map(m => [
              m.type === "credit"
                ? <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><ArrowUpRight size={12} />Crédit</span>
                : <span className="flex items-center gap-1 text-xs font-semibold text-red-500"><ArrowDownRight size={12} />Débit</span>,
              m.libelle,
              m.passager,
              <span className={cn("font-mono font-semibold text-sm", m.type === "credit" ? "text-emerald-600" : "text-red-500")}>{m.montant}</span>,
              <span className="text-xs text-slate-500 dark:text-slate-400">{m.date}</span>,
            ])}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Wallet — Solde global" subtitle="Vue d'ensemble du portefeuille électronique" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="col-span-1 py-6 text-white" style={{ background: "linear-gradient(135deg, #1A56DB, #0BA5C0)" }}>
          <div className="text-xs font-semibold opacity-80 mb-1">Solde total wallets</div>
          <div className="text-3xl font-bold font-mono">2 845 200</div>
          <div className="text-sm opacity-80">FCFA</div>
          <div className="mt-4 flex items-center gap-1 text-xs opacity-70"><ArrowUpRight size={12} /><span>+12.4% vs mois dernier</span></div>
        </Card>
        <Card className="text-center py-6"><div className="text-2xl font-bold font-mono mb-1" style={{ color: C.teal }}>342</div><div className="text-xs text-slate-500 dark:text-slate-400">Wallets actifs</div></Card>
        <Card className="text-center py-6"><div className="text-xl font-bold font-mono mb-1" style={{ color: C.ocean }}>1,8M FCFA</div><div className="text-xs text-slate-500 dark:text-slate-400">Rechargements ce mois</div></Card>
      </div>
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Top wallets par solde</h3>
        <Table
          cols={["Rang", "Passager", "Type", "Solde", "Dernière opération"]}
          rows={passagers.sort((a, b) => parseInt(b.solde) - parseInt(a.solde)).map((p, i) => [
            <span className="font-mono font-bold text-slate-300">#{i + 1}</span>,
            p.nom,
            <Badge label={p.type} color={p.type === "Touriste" ? "blue" : "teal"} />,
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{p.solde}</span>,
            "11 Jul 2026",
          ])}
        />
      </Card>
    </div>
  );
}
