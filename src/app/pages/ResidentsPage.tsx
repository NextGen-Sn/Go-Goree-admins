import { useState } from "react";
import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { ChevronLeft, FileSearch, Eye, CheckCircle, XCircle, Calendar, MapPin, Download } from "lucide-react";
import { 
  useDemandesEnAttente, 
  useDemandesRefusees, 
  useDemandesHistorique, 
  useTraiterDemande 
} from "@/app/hooks/residents/useResidents";
import { toast } from "sonner";

function ResidentsListePage() {
  const { data: demandesResidents = [], isLoading, isError } = useDemandesEnAttente();
  const traiterMutation = useTraiterDemande();

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

  const handleValider = async (id: string) => {
    try {
      await traiterMutation.mutateAsync({ id, statut: "validee" });
      toast.success("Demande de résidence approuvée avec succès.");
      setExamineId(null);
    } catch (err) {
      toast.error("Erreur lors de la validation.");
    }
  };

  const handleRefuser = async (id: string) => {
    if (!refuseReason) {
      toast.error("Veuillez saisir un motif de refus.");
      return;
    }
    try {
      await traiterMutation.mutateAsync({ id, statut: "refusee", motif: refuseReason });
      toast.success("Demande de résidence refusée.");
      setExamineId(null);
      setRefuseMode(false);
      setRefuseReason("");
    } catch (err) {
      toast.error("Erreur lors du refus de la demande.");
    }
  };

  if (examineId) {
    const dem = demandesResidents.find(d => d.id === examineId);
    if (!dem) return null;

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
                {dem.documents && dem.documents.length > 0 ? dem.documents.map(doc => (
                  <div key={doc.name} className="text-center">
                    <div className="h-36 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 flex flex-col items-center justify-center mb-2 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer transition-colors">
                      <FileSearch size={28} className="text-slate-300 mb-2" />
                      <span className="text-xs font-semibold text-slate-500">Aperçu</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 overflow-hidden text-ellipsis whitespace-nowrap px-1" title={doc.name}>{doc.name}</div>
                    <a href={doc.url} target="_blank" rel="noreferrer"
                       className="mt-1 text-xs font-medium flex items-center gap-1 justify-center hover:underline" style={{ color: C.ocean }}>
                      <Eye size={11} /> Télécharger / Visualiser
                    </a>
                  </div>
                )) : (
                  <div className="col-span-3 text-xs text-slate-400 py-6 text-center">Aucune pièce jointe.</div>
                )}
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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Décision administrative</h3>
              <p className="text-xs text-slate-400 mb-4">Vérifiez la conformité des justificatifs fournis avant de valider.</p>
              
              {!refuseMode ? (
                <div className="space-y-2">
                  <button onClick={() => handleValider(dem.id)} disabled={traiterMutation.isPending}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition-colors">
                    <CheckCircle size={14} /> Valider le dossier
                  </button>
                  <button onClick={() => setRefuseMode(true)} disabled={traiterMutation.isPending}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow transition-colors">
                    <XCircle size={14} /> Refuser le dossier
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Motif de refus</label>
                    <textarea rows={3} placeholder="Ex: Certificat de résidence non signé..."
                      className="w-full p-2 text-xs border rounded-lg focus:outline-none"
                      value={refuseReason} onChange={e => setRefuseReason(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRefuser(dem.id)} disabled={traiterMutation.isPending}
                      className="flex-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors">
                      Confirmer refus
                    </button>
                    <button onClick={() => { setRefuseMode(false); setRefuseReason(""); }}
                      className="px-3 py-1.5 border rounded-lg text-xs font-medium">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Demandes en attente" subtitle={`${demandesResidents.length} dossiers à traiter`} />
      
      {demandesResidents.length === 0 ? (
        <Card className="text-center py-12 text-slate-400 text-sm">
          Aucun dossier de résidence en attente d'approbation.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {demandesResidents.map(d => (
            <Card key={d.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{d.nom}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-semibold">{d.id.slice(0,8)}</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {d.date}</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {d.adresse}</span>
                  </div>
                </div>
                <Btn label="Examiner" icon={Eye} variant="primary" onClick={() => setExamineId(d.id)} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResidentsPage({ sub }: { sub: string }) {
  const { data: enAttente = [], isLoading: waitL } = useDemandesEnAttente();
  const { data: refusees = [], isLoading: refL } = useDemandesRefusees();
  const { data: historique = [], isLoading: histL } = useDemandesHistorique();

  const isLoading = waitL || refL || histL;

  const feedback = (
    <div className="space-y-2 mb-4">
      {isLoading && (
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
        <PageHeader title="Demandes refusées" subtitle="Historique des dossiers rejetés" />
        <Card>
          <Table
            cols={["ID", "Nom", "Date", "Motif de refus", "Décision par"]}
            rows={refusees.map(r => [
              <span className="font-mono text-xs text-slate-400" key={`id-${r.id}`}>{r.id.slice(0, 8)}...</span>,
              <span className="font-semibold text-slate-800 dark:text-slate-100" key={`nom-${r.id}`}>{r.nom}</span>,
              <span key={`date-${r.id}`}>{r.date}</span>,
              <span key={`motif-${r.id}`} className="text-red-600 font-medium text-xs bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded">{r.motif_refus || "Documents non conformes"}</span>,
              <span key={`by-${r.id}`}>Administrateur</span>,
            ])}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Historique des demandes" subtitle="Tous les dossiers traités"
        actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          ["Total demandes", historique.length, C.ocean],
          ["Validées", historique.filter(h => h.statut === "Validé").length, C.green],
          ["Refusées", historique.filter(h => h.statut === "Refusé").length, C.red],
          ["En attente", enAttente.length, C.amber],
        ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-3">
            <div className="text-xl font-bold font-mono animate-pulse" style={{ color: c as string }}>{v as string}</div>
            <div className="text-xs text-slate-500 mt-0.5">{l as string}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Table
          cols={["ID", "Nom", "Date", "Adresse", "Statut", "Traité par"]}
          rows={historique.map(d => [
            <span className="font-mono text-xs text-slate-500" key={`id-${d.id}`}>{d.id.slice(0, 8)}...</span>,
            <span className="font-semibold text-slate-800" key={`nom-${d.id}`}>{d.nom}</span>,
            <span key={`date-${d.id}`}>{d.date}</span>,
            <span key={`adr-${d.id}`}>{d.adresse}</span>,
            <StatusBadge key={`statut-${d.id}`} statut={d.statut} />,
            <span key={`by-${d.id}`}>Administrateur</span>,
          ])}
        />
      </Card>
    </div>
  );
}
