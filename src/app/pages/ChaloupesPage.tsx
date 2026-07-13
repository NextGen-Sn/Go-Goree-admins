import { useState } from "react";
import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Anchor, Wrench, Edit, CheckCircle, Plus, X, Trash2 } from "lucide-react";
import { useChaloupes } from "@/app/hooks/useChaloupes";

export default function ChaloupesPage({ sub }: { sub: string }) {
  const { data: chaloupes = [], isLoading, isError } = useChaloupes();
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
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [statuts, setStatuts] = useState<Record<string, string>>(
    Object.fromEntries(chaloupes.map(c => [c.id, c.statut]))
  );

  if (sub === "maintenance") {
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Maintenance de la flotte" subtitle="Gestion des statuts et suivi de maintenance"
          actions={<Btn label="Planifier intervention" icon={Plus} variant="primary" />} />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            ["Chaloupes actives", chaloupes.filter(c => statuts[c.id] === "Actif").length, C.green],
            ["En maintenance", chaloupes.filter(c => statuts[c.id] === "Maintenance").length, C.amber],
            ["Inactives", chaloupes.filter(c => statuts[c.id] === "Inactif").length, C.red],
          ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-3xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as number}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{l as string}</div>
            </Card>
          ))}
        </div>
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Modifier les statuts</h3>
          <div className="space-y-4">
            {chaloupes.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: C.ocean + "15" }}>
                  <Anchor size={18} style={{ color: C.ocean }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{c.nom}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{c.capacite} places · {c.annee}</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Prochaine maint.: <span className="font-semibold">{c.prochaineMaint}</span></div>
                <select
                  value={statuts[c.id]}
                  onChange={e => setStatuts(prev => ({ ...prev, [c.id]: e.target.value }))}
                  className={cn("px-3 py-1.5 text-sm border rounded-lg focus:outline-none font-semibold",
                    statuts[c.id] === "Actif" ? "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                    statuts[c.id] === "Maintenance" ? "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                    "border-slate-200 bg-slate-100 text-slate-600")}
                >
                  <option value="Actif">Actif</option>
                  <option value="Maintenance">En maintenance</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Btn label="Sauvegarder les statuts" icon={CheckCircle} variant="primary" />
          </div>
        </Card>

        <Card className="mt-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Interventions planifiées</h3>
          <Table
            cols={["Chaloupe", "Type d'intervention", "Date prévue", "Technicien", "Priorité"]}
            rows={[
              ["Augustin Elimane Ly", "Révision moteur complet", "En cours", "SN Marine Services", <Badge label="Haute" color="red" />],
              ["Boubacar Joseph Ndiaye", "Contrôle coque annuel", "15 Août 2026", "SONACOS Navires", <Badge label="Normale" color="amber" />],
              ["Coumba Castel", "Révision générale", "22 Sep 2026", "SN Marine Services", <Badge label="Faible" color="gray" />],
            ]}
          />
        </Card>
      </div>
    );
  }

  if (sub === "planning") {
    const slots = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"];
    const activeChaloupes = chaloupes.filter(c => statuts[c.id] === "Actif");
    const plan: Record<string, Record<string, string>> = {
      "Boubacar Joseph Ndiaye": { "07:00": "✓", "11:00": "✓", "15:00": "✓" },
      "Coumba Castel": { "09:00": "✓", "13:00": "✓", "17:00": "✓" },
    };
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Planning de déploiement" subtitle="Affectation des chaloupes aux créneaux"
          actions={<Btn label="Modifier planning" icon={Edit} variant="primary" />} />
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase w-52">Chaloupe</th>
                <th className="px-4 text-xs font-semibold text-slate-400 uppercase">Capacité</th>
                {slots.map(s => <th key={s} className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase">{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {activeChaloupes.map(c => (
                <tr key={c.id} className="border-b border-slate-50 dark:border-slate-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Anchor size={14} style={{ color: C.ocean }} />
                      <span className="font-semibold text-slate-800 text-sm">{c.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 font-mono text-xs text-slate-600">{c.capacite} pl.</td>
                  {slots.map(s => {
                    const active = plan[c.nom]?.[s];
                    return (
                      <td key={s} className="py-2 px-1 text-center">
                        {active
                          ? <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: C.ocean + "20" }}><CheckCircle size={14} style={{ color: C.ocean }} /></div>
                          : <div className="w-8 h-8 rounded-lg border border-dashed border-slate-200 mx-auto" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {chaloupes.filter(c => statuts[c.id] === "Maintenance").map(c => (
                <tr key={c.id} className="border-b border-slate-50 opacity-40">
                  <td className="py-3 px-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Wrench size={14} className="text-amber-500" />
                      <span className="text-sm">{c.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 font-mono text-xs text-slate-400">{c.capacite} pl.</td>
                  {slots.map(s => <td key={s} className="py-2 px-1 text-center"><span className="text-xs text-slate-300">—</span></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Flotte de chaloupes" subtitle={`${chaloupes.length} embarcations enregistrées`}
        actions={<Btn label="Ajouter chaloupe" icon={Plus} variant="primary" onClick={() => setShowAdd(true)} />} />

      {(showAdd || editId) && (
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">{editId ? "Modifier chaloupe" : "Nouvelle chaloupe"}</h3>
            <button onClick={() => { setShowAdd(false); setEditId(null); }} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Nom de la chaloupe", placeholder: "Ex: Boubacar Joseph Ndiaye" },
              { label: "Capacité (places)", placeholder: "450" },
              { label: "Année de mise en service", placeholder: "2018" },
              { label: "Longueur (m)", placeholder: "45" },
              { label: "Type de moteur", placeholder: "4x 420 CV diesel" },
              { label: "Immatriculation", placeholder: "SN-DAK-2018-XXX" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                <input placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Btn label="Enregistrer" icon={CheckCircle} variant="primary" onClick={() => { setShowAdd(false); setEditId(null); }} />
            <Btn label="Annuler" variant="secondary" onClick={() => { setShowAdd(false); setEditId(null); }} />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["Actives", chaloupes.filter(c => c.statut === "Actif").length, C.green],
          ["En maintenance", chaloupes.filter(c => c.statut === "Maintenance").length, C.amber],
          ["Capacité totale", chaloupes.filter(c => c.statut === "Actif").reduce((a, c) => a + c.capacite, 0) + " places", C.ocean],
        ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-4">
            <div className="text-2xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as string | number}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{l as string}</div>
          </Card>
        ))}
      </div>

      <Card>
        <Table
          cols={["ID", "Nom", "Capacité", "Année", "Moteur", "Statut", "Proch. maintenance", "Occupation moy.", ""]}
          rows={chaloupes.map(c => [
            <span className="font-mono text-xs text-slate-400">{c.id}</span>,
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: C.ocean + "15" }}>
                <Anchor size={14} style={{ color: C.ocean }} />
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{c.nom}</span>
            </div>,
            <span className="font-mono font-semibold">{c.capacite}</span>,
            c.annee,
            <span className="text-xs text-slate-500 dark:text-slate-400">{c.moteur}</span>,
            <StatusBadge statut={statuts[c.id] ?? c.statut} />,
            <span className="text-xs">{c.prochaineMaint}</span>,
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" onClick={() => setEditId(c.id)}><Edit size={14} /></button>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>,
          ])}
        />
      </Card>
    </div>
  );
}
