import { PageHeader, Btn, Card, ChartCard, Table, SearchBar } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { Download, Filter, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";
import { usePaiements } from "@/app/hooks/paiements/usePaiements";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function PaiementsPage({ sub }: { sub: string }) {
  const { data: transactions = [], isLoading, isError } = usePaiements();

  // Mock data for graphs & percentages
  const paiementData = [
    { name: "Wave", value: 38, color: "#1E3A8A" },
    { name: "Orange Money", value: 34, color: "#EA580C" },
    { name: "Yas", value: 12, color: C.teal },
    { name: "Carte", value: 10, color: C.ocean },
    { name: "Wallet", value: 6, color: "#10B981" },
  ];

  const monthlyData = [
    { month: "Jan", billets: 400 },
    { month: "Feb", billets: 300 },
    { month: "Mar", billets: 600 },
    { month: "Apr", billets: 800 },
    { month: "May", billets: 500 },
    { month: "Jun", billets: 1247 },
  ];

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
          {[ ["Transactions (mois)", transactions.length, C.ocean], ["Volume (mois)", `${(transactions.length * 5000).toLocaleString("fr-FR")} FCFA`, C.teal], ["Taux de succès", "97.8%", C.green], ["En attente", "0", C.amber] ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-0.5">{l as string}</div>
            </Card>
          ))}
        </div>
        <ChartCard title={`Évolution mensuelle — ${labels[sub] || "Transactions"}`}>
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
            <span className="font-mono text-xs font-semibold" style={{ color: C.ocean }} key={`id-${t.id}`}>{t.id.slice(0, 13)}...</span>,
            <span className="font-semibold text-slate-800" key={`pass-${t.id}`}>{t.passager}</span>,
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100" key={`mont-${t.id}`}>{t.montant}</span>,
            <span key={`meth-${t.id}`}>{t.methode}</span>,
            <span key={`date-${t.id}`} className="text-xs text-slate-500 dark:text-slate-400">{t.date}</span>,
            <StatusBadge key={`stat-${t.id}`} statut={t.statut} />,
            <button key={`act-${t.id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>,
          ])}
        />
      </Card>
    </div>
  );
}
