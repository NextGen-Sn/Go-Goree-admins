import { PageHeader, Btn, Card, ChartCard, Table } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { Ticket, Banknote, Activity, Star, Download } from "lucide-react";
import { monthlyData, pieData, paiementData, hourlyData, chaloupesData } from "@/app/data/mock/dashboard.mock";
import { ResponsiveContainer, AreaChart, Area, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, PieChart as RPieChart, Pie, Cell, Legend, Bar } from "recharts";

export default function StatsPage({ sub }: { sub: string }) {
  if (sub === "billets" || sub === "recettes") {
    return (
      <div className="p-6">
        <PageHeader title={sub === "billets" ? "Statistiques billets" : "Statistiques recettes"} subtitle="Analyse par mois — 2026"
          actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {(sub === "billets"
            ? [["Total billets (ytd)", "62 680", C.ocean], ["Mois record", "Jul: 12 280", C.teal], ["Moyenne/mois", "8 954", C.green], ["Tendance", "+59.9%", C.amber]]
            : [["Recettes totales (ytd)", "313,4M FCFA", C.ocean], ["Mois record", "Jul: 61,4M", C.teal], ["Moyenne/mois", "44,8M FCFA", C.green], ["Croissance", "+59.9%", C.green]]
          ).map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-1">{l as string}</div>
            </Card>
          ))}
        </div>
        <ChartCard title={sub === "billets" ? "Billets vendus par mois — 2026" : "Recettes mensuelles (FCFA) — 2026"}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gradStats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sub === "billets" ? C.ocean : C.teal} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={sub === "billets" ? C.ocean : C.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area key="area" type="monotone" dataKey={sub === "billets" ? "billets" : "recettes"}
                stroke={sub === "billets" ? C.ocean : C.teal} fill="url(#gradStats)" strokeWidth={2.5}
                name={sub === "billets" ? "Billets" : "Recettes (FCFA)"} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    );
  }

  if (sub === "categories" || sub === "paiements") {
    const data = sub === "categories" ? pieData : paiementData;
    return (
      <div className="p-6">
        <PageHeader title={sub === "categories" ? "Catégories de voyageurs" : "Répartition des paiements"} subtitle="Par mois — cumulé 2026" />
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title={sub === "categories" ? "Répartition par type" : "Modes de paiement"} subtitle="Ce mois">
            <ResponsiveContainer width="100%" height={280}>
              <RPieChart>
                <Pie key="pie" data={data} cx="50%" cy="50%" outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine>
                  {data.map((e, i) => <Cell key={`cell-${e.name}-${i}`} fill={e.color} />)}
                </Pie>
                <Tooltip key="tt" formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </RPieChart>
            </ResponsiveContainer>
          </ChartCard>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Détail par catégorie</h3>
            <div className="space-y-3">
              {data.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{d.name}</span>
                    <span className="font-mono text-slate-600">{d.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "heures") {
    return (
      <div className="p-6">
        <PageHeader title="Heures de pointe" subtitle="Distribution horaire mensuelle — moyenne par créneaux" />
        <ChartCard title="Passagers par créneau horaire" subtitle="Moyenne mensuelle 2026">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyData}>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis key="x" dataKey="heure" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar key="bar" dataKey="passagers" name="Passagers" radius={[4, 4, 0, 0]}>
                {hourlyData.map(entry => (
                  <Cell key={`h-${entry.heure}`} fill={entry.passagers > 140 ? C.ocean : entry.passagers > 100 ? C.teal : "#cbd5e1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[ ["Heure la plus chargée", "17h00 (168 pass.)", C.ocean], ["Heure creuse", "07h00 (45 pass.)", C.green], ["Charge moyenne", "103 pass./créneau", C.teal] ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-sm font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-1">{l as string}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sub === "occupation") {
    return (
      <div className="p-6">
        <PageHeader title="Taux d'occupation" subtitle="Analyse mensuelle par chaloupe" />
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title="Occupation par chaloupe — Ce mois">
            <div className="space-y-4 mt-2">
              {chaloupesData.map(c => (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{c.nom}</span>
                    <span className="font-mono text-slate-600">{c.occupation}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.occupation}%`, background: `linear-gradient(90deg, ${C.ocean}, ${C.teal})` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Taux mensuel 2026" subtitle="%">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis key="y" domain={[60, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line key="line" type="monotone" dataKey="occupation" stroke={C.ocean} strokeWidth={2.5} dot={{ fill: C.ocean, r: 3 }} name="Occupation %" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    );
  }

  if (sub === "validation") {
    return (
      <div className="p-6">
        <PageHeader title="Taux de validation QR" subtitle="Analyse mensuelle par mois" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[ ["QR scannés (mois)", "18 432", C.ocean], ["Valides", "17 901", C.green], ["Invalides", "312", C.red], ["Taux global", "97.1%", C.teal] ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-1">{l as string}</div>
            </Card>
          ))}
        </div>
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Taux de validation par contrôleur</h3>
          <div className="space-y-3">
            {[ ["Oumar Fall", 99.1], ["Mariama Diop", 98.6], ["Aliou Ndong", 97.3] ].map(([nom, taux]) => (
              <div key={nom as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{nom as string}</span>
                  <span className="font-mono text-slate-600">{taux as number}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${taux}%`, background: `linear-gradient(90deg, ${C.ocean}, ${C.teal})` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Statistiques — Vue d'ensemble" subtitle="Tableau analytique mensuel 2026"
        actions={<Btn label="Exporter rapport" icon={Download} variant="secondary" />} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.ocean }}>12 280</div>
          <div className="text-xs text-slate-500 mt-0.5">Billets ce mois</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.teal }}>61,4M FCFA</div>
          <div className="text-xs text-slate-500 mt-0.5">Recettes (mois)</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.green }}>94%</div>
          <div className="text-xs text-slate-500 mt-0.5">Taux occupation</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.amber }}>4.8/5</div>
          <div className="text-xs text-slate-500 mt-0.5">Satisfaction</div>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Billets vendus par mois — 2026">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend key="lg" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
              <Bar key="bar" dataKey="billets" fill={C.ocean} radius={[3, 3, 0, 0]} name="Billets" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Répartition passagers — Ce mois">
          <ResponsiveContainer width="100%" height={200}>
            <RPieChart>
              <Pie key="pie" data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value">
                {pieData.map(e => <Cell key={`cell-${e.name}`} fill={e.color} />)}
              </Pie>
              <Tooltip key="tt" formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend key="lg" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
            </RPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
