import { PageHeader, Btn, Card, Table, SearchBar } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { Download, Filter, Eye } from "lucide-react";
import { usePaiements } from "@/app/hooks/paiements/usePaiements";

export default function PaiementsPage({ sub }: { sub: string }) {
  const { data: transactions = [], isLoading, isError } = usePaiements();

  // Répartition par méthode calculée depuis les transactions réelles (mode = enum backend).
  const MODE_META: Record<string, { label: string; color: string }> = {
    WAVE: { label: "Wave", color: "#1E3A8A" },
    ORANGE_MONEY: { label: "Orange Money", color: "#EA580C" },
    YAS: { label: "Yas", color: C.teal },
    CARTE_BANCAIRE: { label: "Carte", color: C.ocean },
    PORTEFEUILLE: { label: "Wallet", color: "#10B981" },
    PAYDUNYA: { label: "PayDunya", color: "#7C3AED" },
  };

  const paiementData = (() => {
    const counts: Record<string, number> = {};
    transactions.forEach((t: any) => {
      const m = t.mode || "—";
      counts[m] = (counts[m] || 0) + 1;
    });
    const total = transactions.length || 1;
    return Object.entries(counts)
      .map(([mode, n]) => ({
        name: MODE_META[mode]?.label ?? mode,
        value: Math.round((n / total) * 100),
        color: MODE_META[mode]?.color ?? C.ocean,
      }))
      .sort((a, b) => b.value - a.value);
  })();

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
    const subToMode: Record<string, string> = { wave: "WAVE", orange: "ORANGE_MONEY", yas: "YAS", carte: "CARTE_BANCAIRE" };
    const mode = subToMode[sub] ?? sub.toUpperCase();
    const filtered = transactions.filter((t: any) => t.mode === mode);
    const volume = filtered.reduce((a: number, t: any) => a + (t.montantValue || 0), 0);
    const nbSucces = filtered.filter((t: any) => t.statut === "Validé").length;
    const tauxSucces = filtered.length ? `${Math.round((nbSucces / filtered.length) * 100)}%` : "—";
    const enAttente = filtered.filter((t: any) => t.statut === "En cours").length;

    return (
      <div className="p-6">
        {feedback}
        <PageHeader title={labels[sub] ?? sub} subtitle="Transactions réelles sur ce moyen de paiement" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[ ["Transactions", filtered.length, C.ocean], ["Volume", `${volume.toLocaleString("fr-FR")} FCFA`, C.teal], ["Taux de succès", tauxSucces, C.green], ["En attente", enAttente, C.amber] ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-0.5">{l as string}</div>
            </Card>
          ))}
        </div>
        <Card>
          <Table
            cols={["ID Transaction", "Passager", "Montant", "Date", "Statut"]}
            rows={filtered.map((t: any) => [
              <span className="font-mono text-xs font-semibold" style={{ color: C.ocean }} key={`id-${t.id}`}>{t.id.slice(0, 13)}...</span>,
              <span className="font-semibold text-slate-800" key={`pass-${t.id}`}>{t.passager}</span>,
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100" key={`mont-${t.id}`}>{t.montant}</span>,
              <span key={`date-${t.id}`} className="text-xs text-slate-500 dark:text-slate-400">{t.date}</span>,
              <StatusBadge key={`stat-${t.id}`} statut={t.statut} />,
            ])}
          />
        </Card>
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
            <span key={`meth-${t.id}`}>{MODE_META[t.mode]?.label ?? t.methode}</span>,
            <span key={`date-${t.id}`} className="text-xs text-slate-500 dark:text-slate-400">{t.date}</span>,
            <StatusBadge key={`stat-${t.id}`} statut={t.statut} />,
            <button key={`act-${t.id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>,
          ])}
        />
      </Card>
    </div>
  );
}
