import { useState } from "react";
import { Btn, Card, PageHeader, Table } from "@/app/components/ui/Shared";
import { C, Badge, StatusBadge, cn } from "@/app/components/layout/common";
import { Plus, Edit, Trash2, CheckCircle, X, Ban, Check } from "lucide-react";
import { 
  useControleurs, 
  useCreateControleur, 
  useUpdateControleur, 
  useDeleteControleur 
} from "@/app/hooks/controleurs/useControleurs";
import { toast } from "sonner";

export default function CtrlPage({ sub }: { sub: string }) {
  const { data: controleurs = [], isLoading, isError } = useControleurs();
  const createMutation = useCreateControleur();
  const updateMutation = useUpdateControleur();
  const deleteMutation = useDeleteControleur();

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

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

  const handleOpenEdit = (c: any) => {
    setEditId(c.id);
    setNom(c.nom);
    setTel(c.tel);
    setEmail(c.email);
    setShowAdd(true);
  };

  const handleCloseForm = () => {
    setShowAdd(false);
    setEditId(null);
    setNom("");
    setTel("");
    setEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !email) {
      toast.error("Veuillez remplir le nom et l'email.");
      return;
    }

    try {
      if (editId) {
        await updateMutation.mutateAsync({
          id: editId,
          payload: { nom, email, tel },
        });
        toast.success("Contrôleur mis à jour avec succès.");
      } else {
        await createMutation.mutateAsync({ nom, email, tel });
        toast.success("Contrôleur invité avec succès. Un e-mail d'activation a été envoyé.");
      }
      handleCloseForm();
    } catch (err: any) {
      toast.error("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatut: string) => {
    try {
      const nextStatut = currentStatut === "Actif" ? "Inactif" : "Actif";
      await updateMutation.mutateAsync({
        id,
        payload: { statut: nextStatut },
      });
      toast.success(`Contrôleur ${nextStatut === "Actif" ? "activé" : "désactivé"} avec succès.`);
    } catch (err) {
      toast.error("Impossible de modifier le statut.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contrôleur ?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Contrôleur supprimé avec succès.");
      } catch (err) {
        toast.error("Impossible de supprimer le contrôleur.");
      }
    }
  };

  if (sub === "planning") {
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
                      <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse" style={{ background: C.sidebarActive }}>{c.nom[0]}</div>
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
            {["Matin", "Après-midi", "Soir"].map((label) => (
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

      {showAdd && (
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/10">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{editId ? "Modifier contrôleur" : "Nouveau contrôleur"}</h3>
              <button type="button" onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Nom complet</label>
                <input placeholder="Ex: Oumar Fall" value={nom} onChange={e => setNom(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Téléphone</label>
                <input placeholder="Ex: 77 123 45 67" value={tel} onChange={e => setTel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email</label>
                <input type="email" placeholder="Ex: oumar.fall@goree.sn" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" required />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors">
                <CheckCircle size={14} /> Enregistrer
              </button>
              <Btn label="Annuler" variant="secondary" onClick={handleCloseForm} />
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table
          cols={["ID", "Nom", "Téléphone", "Email", "Shift", "Chaloupe affectée", "Statut", "Actions"]}
          rows={controleurs.map(c => [
            <span className="font-mono text-xs text-slate-400" key={`id-${c.id}`}>{c.id.slice(0, 8)}...</span>,
            <div className="flex items-center gap-2" key={`nom-${c.id}`}>
              <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: C.sidebarActive }}>{c.nom[0]}</div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{c.nom}</span>
            </div>,
            <span key={`tel-${c.id}`}>{c.tel}</span>,
            <span key={`email-${c.id}`}>{c.email}</span>,
            <Badge key={`shift-${c.id}`} label={c.shift} color="blue" />,
            <span key={`chaloupe-${c.id}`}>{c.chaloupe}</span>,
            <StatusBadge key={`statut-${c.id}`} statut={c.statut} />,
            <div className="flex gap-1.5 items-center" key={`actions-${c.id}`}>
              <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition-colors" onClick={() => handleOpenEdit(c)} title="Modifier"><Edit size={14} /></button>
              <button className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors", c.statut === "Actif" ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600")}
                 onClick={() => handleToggleStatus(c.id, c.statut)}
                 title={c.statut === "Actif" ? "Désactiver (Passer inactif)" : "Activer (Passer actif)"}>
                 {c.statut === "Actif" ? <Ban size={14} /> : <Check size={14} />}
              </button>
              <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors" onClick={() => handleDelete(c.id)} title="Supprimer"><Trash2 size={14} /></button>
            </div>,
          ])}
        />
      </Card>
    </div>
  );
}
