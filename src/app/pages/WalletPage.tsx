import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Download, ArrowUpRight, ArrowDownRight, Database } from "lucide-react";
import { 
  useWalletInfo, 
  useWalletMovements 
} from "@/app/hooks/wallet/useWallet";
import { usePassagers } from "@/app/hooks/passagers/usePassagers";

export default function WalletPage({ sub }: { sub: string }) {
  const { data: mouvements = [], isLoading: mvtLoading, isError: mvtError } = useWalletMovements();
  const { data: passagers = [], isLoading: pLoading, isError: pError } = usePassagers();
  const { data: walletInfo, isLoading: infoLoading, isError: infoError } = useWalletInfo();

  const isLoading = mvtLoading || pLoading || infoLoading;
  const isError = mvtError || pError || infoError;

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
            rows={filtered.map((m, idx) => [
              m.type === "credit"
                ? <span key={`type-${idx}`} className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><ArrowUpRight size={12} />Crédit</span>
                : <span key={`type-${idx}`} className="flex items-center gap-1 text-xs font-semibold text-red-500"><ArrowDownRight size={12} />Débit</span>,
              <span key={`lib-${idx}`}>{m.libelle}</span>,
              <span key={`pass-${idx}`}>{m.passager}</span>,
              <span key={`mont-${idx}`} className={cn("font-mono font-semibold text-sm", m.type === "credit" ? "text-emerald-600" : "text-red-500")}>{m.montant}</span>,
              <span key={`date-${idx}`} className="text-xs text-slate-500 dark:text-slate-400">{m.date}</span>,
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
        <Card className="col-span-1 py-6 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #1A56DB, #0BA5C0)" }}>
          <div className="text-xs font-semibold opacity-80 mb-1">Solde global des wallets</div>
          <div className="text-3xl font-bold font-mono">{walletInfo?.soldeGlobal || "0 FCFA"}</div>
          <div className="mt-4 flex items-center gap-1 text-xs opacity-70"><ArrowUpRight size={12} /><span>Temps réel synchronisé</span></div>
        </Card>
        <Card className="text-center py-6"><div className="text-2xl font-bold font-mono mb-1" style={{ color: C.teal }}>{walletInfo?.walletsActifs ?? passagers.length}</div><div className="text-xs text-slate-500">Wallets clients actifs</div></Card>
        <Card className="text-center py-6"><div className="text-xl font-bold font-mono mb-1" style={{ color: C.ocean }}>{mouvements.filter(m => m.type === "credit").length}</div><div className="text-xs text-slate-500">Rechargements enregistrés</div></Card>
      </div>
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Top wallets par solde</h3>
        <Table
          cols={["Rang", "Passager", "Type", "Solde", "Statut"]}
          rows={[...passagers].sort((a, b) => b.soldeValue - a.soldeValue).map((p, i) => [
            <span className="font-mono font-bold text-slate-300" key={`rank-${i}`}>#{i + 1}</span>,
            <span key={`name-${i}`}>{p.nom}</span>,
            <Badge key={`badge-${i}`} label={p.statut} color={p.statut === "Résident" ? "teal" : "blue"} />,
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100" key={`solde-${i}`}>{p.solde}</span>,
            <Badge key={`state-${i}`} label="Actif" color="green" />,
          ])}
        />
      </Card>
    </div>
  );
}
