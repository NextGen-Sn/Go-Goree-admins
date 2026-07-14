import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, AreaChart, Area, PieChart as RPieChart, Pie, Legend } from "recharts";
import { KPICard, ChartCard, PageHeader, Btn, Table, Card, OccBar } from "@/app/components/ui/Shared";
import { Badge, StatusBadge, cn, C } from "@/app/components/layout/common";
import { RefreshCw, FileText, Ticket, Banknote, Ship, Users, Scan, Wallet as WalletIcon, FileCheck, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useDashboard } from "@/app/hooks/dashboard/useDashboard";

export default function DashboardPage() {
  const { ticketData, monthlyData, pieData, voyages, transactions, isLoading, isError } = useDashboard();

  return (
    <div className="p-6 space-y-6">
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

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Bonjour, Administrateur</h1>
          <p className="text-sm text-slate-500 mt-0.5">Vendredi 11 Juillet 2026 — Dakar ↔ Île de Gorée</p>
        </div>
        <div className="flex gap-2">
          <Btn label="Actualiser" icon={RefreshCw} variant="secondary" />
          <Btn label="Rapport du jour" icon={FileText} variant="primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Billets vendus" value="834" sub="aujourd'hui" icon={Ticket} trend={{ val: "+12%", up: true }} color={C.ocean} />
        <KPICard title="Recettes du jour" value="4,17M FCFA" sub="en cours" icon={Banknote} trend={{ val: "+8%", up: true }} color={C.teal} />
        <KPICard title="Voyages effectués" value="4 / 6" sub="ce jour" icon={Ship} color={C.green} />
        <KPICard title="Passagers embarqués" value="1 278" sub="aujourd'hui" icon={Users} trend={{ val: "+5%", up: true }} color={C.amber} />
        <KPICard title="QR validés" value="1 243" sub="sur 1 278 embarqués" icon={Scan} trend={{ val: "97.3%", up: true }} color={C.purple} />
        <KPICard title="Solde Wallet" value="2,84M FCFA" sub="total passagers" icon={WalletIcon} trend={{ val: "+320K", up: true }} color={C.ocean} />
        <KPICard title="Demandes résidents" value="8" sub="en attente" icon={FileCheck} color={C.amber} />
        <KPICard title="Taux d'occupation" value="88%" sub="moyenne du jour" icon={BarChart3} trend={{ val: "+3%", up: true }} color={C.teal} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ChartCard title="Billets vendus — 7 derniers jours">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={ticketData}>
                <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis key="x" dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar key="bar" dataKey="billets" name="Billets" radius={[4, 4, 0, 0]}>
                  {ticketData.map((_, i) => <Cell key={`c-${i}`} fill={i === 5 || i === 6 ? C.teal : C.ocean} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <ChartCard title="Passagers par catégorie" subtitle="Ce mois">
          <ResponsiveContainer width="100%" height={240}>
            <RPieChart>
              <Pie key="pie" data={pieData} cx="50%" cy="44%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value">
                {pieData.map((e) => <Cell key={`cell-${e.name}`} fill={e.color} />)}
              </Pie>
              <Tooltip key="tt" formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend key="lg" verticalAlign="bottom" iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            </RPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Voyages du jour — 11 Juillet 2026</h3>
        </div>
        <Table
          cols={["ID", "Départ", "Arrivée", "Chaloupe", "Places", "Vendus", "Occupation", "Statut", "Recette"]}
          rows={voyages.map(v => [
            <span className="font-mono text-xs text-slate-500">{v.id}</span>,
            <span className="font-mono font-bold text-slate-900">{v.depart}</span>,
            v.arrivee, v.chaloupe,
            <span className="font-mono">{v.places}</span>,
            <span className="font-mono">{v.vendus}</span>,
            <OccBar val={v.vendus === 0 ? 0 : Math.round((v.vendus / v.places) * 100)} />,
            <StatusBadge statut={v.statut} />,
            <span className="font-mono text-xs">{v.recette}</span>,
          ])}
        />
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Recettes mensuelles 2026" subtitle="En millions FCFA">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.ocean} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.ocean} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" formatter={(v: number) => `${(v / 1000000).toFixed(1)}M FCFA`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area key="area" type="monotone" dataKey="recettes" stroke={C.ocean} fill="url(#gradDash)" strokeWidth={2.5} name="Recettes" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Dernières transactions</h3>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((t, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: C.sidebarActive }}>
                    {t.passager[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{t.passager}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{t.methode} · {t.date.split(", ")[1]}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100">{t.montant}</div>
                  <StatusBadge statut={t.statut} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
