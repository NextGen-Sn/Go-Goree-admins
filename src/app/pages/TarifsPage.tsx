import { useState } from "react";
import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, Badge, cn } from "@/app/components/layout/common";
import { Ticket, CheckCircle, Edit, X, Plus, Clock } from "lucide-react";
import { useTarifsCategories } from "@/app/hooks/useTarifs";

export default function TarifsPage({ sub }: { sub: string }) {
  const [editing, setEditing] = useState(false);
  const { data: cats = [], isLoading, isError } = useTarifsCategories();
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

  if (sub === "categories") {
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Catégories de passagers" subtitle="Types de voyageurs reconnus" actions={<Btn label="Nouvelle catégorie" icon={Plus} variant="primary" />} />
        <div className="grid grid-cols-3 gap-4">
          {cats.map((c, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">{c.cat}</h3>
                <button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Edit size={13} /></button>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tarif aller-retour</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{c.tarif} FCFA</span>
                </div>
                {c.abonnement && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Abonnement mensuel</span>
                    <span className="font-mono font-semibold" style={{ color: C.teal }}>{c.abonnement} FCFA</span>
                  </div>
                )}
              </div>
              {c.abonnement && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <Badge label="Abonnement disponible" color="teal" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sub === "horaires") {
    return (
      <div className="p-6">
        <PageHeader title="Horaires de traversée" subtitle="Créneaux de départ en vigueur"
          actions={<Btn label="Modifier horaires" icon={Edit} variant="primary" />} />
        <div className="grid grid-cols-2 gap-6">
          {[
            ["Jours ouvrés (Lun–Ven)", ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"]],
            ["Week-end & Jours fériés", ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]],
          ].map(([label, slots]) => (
            <Card key={label as string}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">{label as string}</h3>
              <div className="flex flex-wrap gap-2">
                {(slots as string[]).map(s => (
                  <div key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold border"
                    style={{ background: C.ocean + "10", borderColor: C.ocean + "30", color: C.ocean }}>
                    <Clock size={12} />
                    {s}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Grille tarifaire" subtitle="Tarifs en vigueur — tous les billets sont valables aller-retour"
        actions={<>
          <Btn label={editing ? "Annuler" : "Modifier les tarifs"} icon={editing ? X : Edit} variant="secondary" onClick={() => setEditing(!editing)} />
          <Btn label="Publier" icon={CheckCircle} variant="primary" />
        </>} />

      <div className="flex items-center gap-3 mb-5 px-4 py-2.5 rounded-xl border text-sm" style={{ background: C.teal + "10", borderColor: C.teal + "30", color: C.teal }}>
        <Ticket size={16} />
        <span className="font-semibold">Tous les tarifs sont pour un billet aller-retour (Dakar ↔ Gorée). L'abonnement mensuel est réservé aux résidents.</span>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Catégorie</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Tarif aller-retour (FCFA)</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Abonnement mensuel (résidents)</th>
              {editing && <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {cats.map((c, i) => (
              <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-800">{c.cat}</td>
                <td className="py-3 px-4 text-center">
                  {editing ? (
                    <input defaultValue={c.tarif} className="w-24 text-center px-2 py-1 text-sm border border-blue-300 rounded-lg focus:outline-none font-mono font-semibold" style={{ color: C.ocean }} />
                  ) : (
                    <span className="font-mono font-bold text-lg" style={{ color: C.ocean }}>{c.tarif}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {c.abonnement ? (
                    editing ? (
                      <input defaultValue={c.abonnement} className="w-28 text-center px-2 py-1 text-sm border border-teal-300 rounded-lg focus:outline-none font-mono font-semibold" style={{ color: C.teal }} />
                    ) : (
                      <span className="font-mono font-semibold" style={{ color: C.teal }}>{c.abonnement} FCFA/mois</span>
                    )
                  ) : (
                    <span className="text-slate-300 text-xs">Non applicable</span>
                  )}
                </td>
                {editing && (
                  <td className="py-3 px-4 text-center">
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={14} /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {editing && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <Btn label="Sauvegarder les modifications" icon={CheckCircle} variant="primary" onClick={() => setEditing(false)} />
            <Btn label="Annuler" variant="secondary" onClick={() => setEditing(false)} />
          </div>
        )}
      </Card>
    </div>
  );
}
