import { useState } from "react";
import { Btn, Card, PageHeader, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Plus, Edit, Trash2, CheckCircle, X, Anchor, Wrench } from "lucide-react";
import { useControleurs } from "@/app/hooks/useControleurs";

export default function CtrlPage({ sub }: { sub: string }) {
  const { data: controleurs = [], isLoading, isError } = useControleurs();
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

  if (sub === "planning") {
    const slots = ["06:00–14:00", "14:00–22:00", "18:00–00:00"];
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const assignments: Record<string, Record<string, string>> = {
      "Oumar Fall": { Lun: "Matin", Mar: "Matin", Mer: "Repos", Jeu: "Matin", Ven: "Matin", Sam: "Soir", Dim: "Repos" },
      "Mariama Diop": { Lun: "Après-midi", Mar: "Repos", Mer: "Après-midi", Jeu: "Après-midi", Ven: "Repos", Sam: "Après-midi", Dim: "Après-midi" },
      "Aliou Ndong": { Lun: "Soir", Mar: "Soir", Mer: "Soir", Jeu: "Repos", Ven: "Soir", Sam: "Matin", Dim: "Soir" },
    };

    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Planning contrôleurs" subtitle="Horaires de la semaine en cours"
          actions={<Btn label="Modifier planning" icon={Edit} variant="primary" />} />
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Contrôleur</th>
                {days.map(d => <th key={d} className="text-center py-3 px-2 text-xs font-semibold text-slate-400 uppercase">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {controleurs.filter(c => c.statut === "Actif").map(c => (
                <tr key={c.id} className="border-b border-slate-50 dark:border-slate-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.sidebarActive }}>{c.nom[0]}</div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{c.nom}</span>
                    </div>
                  </td>
                  {days.map(d => {
                    const shift = assignments[c.nom]?.[d] ?? "Repos";
                    return (
                      <td key={d} className="py-2 px-1 text-center">
                        {shift === "Repos"
                          ? <span className="text-xs text-slate-300">Repos</span>
                          : <Badge label={shift} color={shift === "Matin" ? "blue" : shift === "Après-midi" ? "teal" : "purple"} />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card className="mt-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Légende des horaires</h3>
          <div className="flex gap-4 text-xs text-slate-600">
            {["Matin", "Après-midi", "Soir"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <Badge label={label} color={label === "Matin" ? "blue" : label === "Après-midi" ? "teal" : "purple"} />
                <span className="text-slate-400">{label === "Matin" ? "06:00 – 14:00" : label === "Après-midi" ? "14:00 – 22:00" : "18:00 – 00:00"}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Contrôleurs" subtitle={`${controleurs.length} contrôleurs enregistrés`}
        actions={<Btn label="Ajouter contrôleur" icon={Plus} variant="primary" onClick={() => setShowAdd(true)} />} />

      {(showAdd || editId) && (
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">{editId ? "Modifier contrôleur" : "Nouveau contrôleur"}</h3>
            <button onClick={() => { setShowAdd(false); setEditId(null); }} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Nom complet", placeholder: "Ex: Oumar Fall" },
              { label: "Téléphone", placeholder: "+221 77 xxx xx xx" },
              { label: "Email", placeholder: "prenom.nom@gogoree.sn" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{f.label}</label>
                <input placeholder={f.placeholder} defaultValue={editId ? controleurs.find(c => c.id === editId)?.[f.label.toLowerCase().split(" ")[0] as keyof typeof controleurs[0]] as string : ""}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Shift par défaut</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none">
                <option>Matin (06h-14h)</option><option>Après-midi (14h-22h)</option><option>Soir (18h-00h)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Chaloupe affectée</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none">
                {controleurs.filter(c => c.statut === "Actif").map(c => <option key={c.id}>{c.nom}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Btn label="Enregistrer" icon={CheckCircle} variant="primary" onClick={() => { setShowAdd(false); setEditId(null); }} />
            <Btn label="Annuler" variant="secondary" onClick={() => { setShowAdd(false); setEditId(null); }} />
          </div>
        </Card>
      )}

      <Card>
        <Table
          cols={["ID", "Nom", "Téléphone", "Email", "Shift", "Chaloupe affectée", "Statut", ""]}
          rows={controleurs.map(c => [
            <span className="font-mono text-xs text-slate-400">{c.id}</span>,
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.sidebarActive }}>{c.nom[0]}</div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{c.nom}</span>
            </div>,
            c.tel, c.email, c.shift, c.chaloupe,
            <StatusBadge statut={c.statut} />,
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
