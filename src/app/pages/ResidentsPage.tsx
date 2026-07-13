import { useState } from "react";
import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge } from "@/app/components/layout/common";
import { ChevronLeft, FileSearch, Eye, CheckCircle, XCircle, Calendar, MapPin } from "lucide-react";
import { useDemandesResidents } from "@/app/hooks/useResidents";

function ResidentsListePage() {
  const { data: demandesResidents = [], isLoading, isError } = useDemandesResidents();
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
  const [examineId, setExamineId] = useState<string | null>(null);
  const [refuseMode, setRefuseMode] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");

  if (examineId) {
    const dem = demandesResidents.find(d => d.id === examineId)!;
    return (
      <div className="p-6">
        {feedback}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setExamineId(null); setRefuseMode(false); setRefuseReason(""); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">
            <ChevronLeft size={16} /> Retour à la liste
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Examen — {dem.nom} ({dem.id})</span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Documents soumis</h3>
              <div className="grid grid-cols-3 gap-4">
                {dem.docs.map(doc => (
                  <div key={doc} className="text-center">
                    <div className="h-36 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 flex flex-col items-center justify-center mb-2 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer transition-colors">
                      <FileSearch size={28} className="text-slate-300 mb-2" />
                      <span className="text-xs font-semibold text-slate-500">Aperçu</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{doc}</div>
                    <button className="mt-1 text-xs font-medium flex items-center gap-1 mx-auto hover:underline" style={{ color: C.ocean }}>
                      <Eye size={11} /> Visualiser
                    </button>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Informations déclarées</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Nom complet", dem.nom],
                  ["N° CIN / Passeport", dem.cin],
                  ["Adresse", dem.adresse],
                  ["Date de soumission", dem.date],
                ].map(([k, v]) => (
                  <div key={k}><div className="text-xs text-slate-400 mb-0.5">{k}</div><div className="font-medium text-slate-800 dark:text-slate-200">{v}</div></div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Décision</h3>
              <div className="space-y-3">
                {!refuseMode ? (
                  <>
                    <button onClick={() => { setExamineId(null); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                      style={{ background: C.green }}>
                      <CheckCircle size={15} /> Valider la demande
                    </button>
                    <button onClick={() => setRefuseMode(true)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-200 dark:border-red-700">
                      <XCircle size={15} /> Refuser la demande
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-700">
                      <div className="text-xs font-semibold text-red-700 mb-2">Motif de refus (obligatoire)</div>
                      <textarea
                        className="w-full text-sm border border-red-200 dark:border-red-700 rounded-lg p-2 focus:outline-none resize-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        rows={4}
                        placeholder="Précisez le motif de refus..."
                        value={refuseReason}
                        onChange={e => setRefuseReason(e.target.value)}
                      />
                    </div>
                    <button
                      disabled={!refuseReason.trim()}
                      onClick={() => { if (refuseReason.trim()) { setExamineId(null); setRefuseMode(false); setRefuseReason(""); } }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: C.red }}>
                      <XCircle size={15} /> Confirmer le refus
                    </button>
                    <button onClick={() => setRefuseMode(false)}
                      className="w-full text-sm text-slate-500 hover:text-slate-700 py-1 transition-colors">
                      Annuler
                    </button>
                  </>
                )}
              </div>
            </Card>
            <Card>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between"><span className="text-slate-400">Documents soumis</span><span className="font-semibold text-slate-800 dark:text-slate-100">{dem.docs.length}/3</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Complétude</span>
                  <Badge label={dem.docs.length >= 3 ? "Complète" : "Incomplète"} color={dem.docs.length >= 3 ? "green" : "amber"} />
                </div>
                <div className="flex justify-between"><span className="text-slate-400">Statut</span><StatusBadge statut={dem.statut} /></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Demandes résidents — En attente" subtitle={`${demandesResidents.length} demandes à traiter`} />
      <div className="space-y-3">
        {demandesResidents.map(d => (
          <Card key={d.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
                style={{ background: C.sidebarActive }}>
                {d.nom.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{d.nom}</span>
                  <span className="font-mono text-xs text-slate-400">{d.id}</span>
                  <StatusBadge statut={d.statut} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {d.date}</span>
                  <span>Docs: {d.docs.join(", ")}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {d.adresse}</span>
                </div>
              </div>
              <Btn label="Examiner" icon={Eye} variant="primary" onClick={() => setExamineId(d.id)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ResidentsPage({ sub }: { sub: string }) {
  const { data: demandesResidents = [], isLoading: oLoading, isError: oError } = useDemandesResidents();
  const feedback = (
    <div className="space-y-2 mb-4">
      {oError && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
          Données indisponibles — affichage des dernières données connues.
        </div>
      )}
      {oLoading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-slate-400" />
        </div>
      )}
    </div>
  );

  if (sub === "liste") return <ResidentsListePage />;

  if (sub === "refusees") {
    return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Demandes refusées" subtitle="Historique des demandes non validées" />
        <Card>
          <Table
            cols={["ID", "Nom", "Date", "Motif de refus", "Décision par"]}
            rows={[
              ["DR-0221", "Moustapha Sy", "28 Jun 2026", "Documents incomplets — certificat manquant", "Administrateur"],
              ["DR-0215", "Aïssatou Dieng", "15 Jun 2026", "Photo non conforme aux normes", "Administrateur"],
              ["DR-0208", "Omar Touré", "01 Jun 2026", "Adresse non vérifiable sur l'île", "Administrateur"],
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Historique des demandes" subtitle="Toutes les demandes depuis l'ouverture"
        actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[ ["Total demandes", "427", C.ocean], ["Validées", "389", C.green], ["Refusées", "29", C.red], ["En attente", "9", C.amber] ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-3">
            <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
            <div className="text-xs text-slate-500 mt-0.5">{l as string}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Table
          cols={["ID", "Nom", "Date", "Statut", "Traité par"]}
          rows={[
            ...demandesResidents,
            { id: "DR-0230", nom: "Ibrahima Diagne", date: "07 Jul 2026", docs: [], statut: "Validé", cin: "", adresse: "" },
            { id: "DR-0229", nom: "Fatou Cissokho", date: "05 Jul 2026", docs: [], statut: "Validé", cin: "", adresse: "" },
            { id: "DR-0221", nom: "Moustapha Sy", date: "28 Jun 2026", docs: [], statut: "Refusé", cin: "", adresse: "" },
          ].map(d => [
            <span className="font-mono text-xs text-slate-500">{d.id}</span>,
            d.nom, d.date,
            <StatusBadge statut={d.statut} />,
            "Administrateur",
          ])}
        />
      </Card>
    </div>
  );
}
