import { PageHeader, Btn, Card, ChartCard, Table, SearchBar } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge } from "@/app/components/layout/common";
import { Download, Filter, Ticket, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";
import { useRepartitionPaiements, usePaiementsMonthly, useTransactions } from "@/app/hooks/usePaiements";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function PaiementsPage({ sub }: { sub: string }) {
  const { data: paiementData = [], isLoading: rLoading, isError: rError } = useRepartitionPaiements();
  const { data: monthlyData = [], isLoading: mLoading, isError: mError } = usePaiementsMonthly();
  const { data: transactions = [], isLoading: tLoading, isError: tError } = useTransactions();
  const isLoading = rLoading || mLoading || tLoading;
  const isError = rError || mError || tError;
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

  if (sub !== "transactions") {
    const labels: Record<string, string> = { wave: "Wave Mobile Money", orange: "Orange Money", yas: "Yas by BICIS", carte: "Carte bancaire" };
    const colorMap: Record<string, string> = { wave: "#1E3A8A", orange: "#EA580C", yas: C.teal, carte: C.ocean };
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title={labels[sub] ?? sub} subtitle="Statistiques et transactions du mois" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[ ["Transactions (mois)", "1 247", C.ocean], ["Volume (mois)", "6,2M FCFA", C.teal], ["Taux de succès", "97.8%", C.green], ["En attente", "18", C.amber] ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-0.5">{l as string}</div>
            </Card>
          ))}
        </div>
        <ChartCard title={`Évolution mensuelle — ${labels[sub]}`}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar key="bar" dataKey="billets" fill={colorMap[sub] ?? C.ocean} radius={[4, 4, 0, 0]} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Transactions" subtitle="Toutes les transactions de paiement"
        actions={<><Btn label="Exporter" icon={Download} variant="secondary" /><Btn label="Filtrer" icon={Filter} variant="secondary" /></>} />
      <div className="grid grid-cols-5 gap-3 mb-6">
        {paiementData.map(p => (
          <Card key={p.name} className="text-center py-3">
            <div className="text-sm font-bold font-mono mb-0.5" style={{ color: p.color }}>{p.value}%</div>
            <div className="text-[10px] text-slate-500">{p.name}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="flex gap-2 mb-4">
          <SearchBar placeholder="Rechercher par passager, ID..." />
        </div>
        <Table
          cols={["ID Transaction", "Passager", "Montant", "Méthode", "Date", "Statut", ""]}
          rows={transactions.map(t => [
            <span className="font-mono text-xs font-semibold" style={{ color: C.ocean }}>{t.id}</span>,
            t.passager,
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{t.montant}</span>,
            t.methode, t.date,
            <StatusBadge statut={t.statut} />,
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>,
          ])}
        />
      </Card>
    </div>
  );
}
