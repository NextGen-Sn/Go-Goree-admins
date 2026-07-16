import { useState } from "react";
import { Btn, Card, PageHeader, Table , Loader } from "@/app/components/ui/Shared";
import { C, StatusBadge, cn } from "@/app/components/layout/common";
import { Plus, Edit, Trash2, CheckCircle, X, Ban, Check, Mail } from "lucide-react";
import { 
  useControleurs, 
  useCreateControleur, 
  useUpdateControleur, 
  useDeleteControleur,
  useResendControleurInvitation
} from "@/app/hooks/controleurs/useControleurs";
import { toast } from "sonner";
import { useConfirm } from "@/app/hooks/useConfirm";

export default function CtrlPage({ sub }: { sub: string }) {
  const { confirmAction, ConfirmModal } = useConfirm();
  const { data: controleurs = [], isLoading, isError } = useControleurs();
  const createMutation = useCreateControleur();
  const updateMutation = useUpdateControleur();
  const deleteMutation = useDeleteControleur();
  const resendMutation = useResendControleurInvitation();

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");


  const handleResendInvitation = async (id: string) => {
    try {
      await resendMutation.mutateAsync(id);
      toast.success("E-mail d'activation renvoyé avec succès.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Impossible de renvoyer l'invitation.";
      toast.error(msg);
    }
  };

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
    confirmAction("Suppression", "Êtes-vous sûr de vouloir supprimer ce contrôleur ?", async () => {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Contrôleur supprimé avec succès.");
      } catch (err) {
        toast.error("Impossible de supprimer le contrôleur.");
      }
    });
  };

  return (
    <div className="p-6">
      <ConfirmModal />
      <PageHeader title="Contrôleurs" subtitle={`${controleurs.length} contrôleur${controleurs.length > 1 ? "s" : ""} enregistré${controleurs.length > 1 ? "s" : ""}`}
        actions={<Btn label="Ajouter contrôleur" icon={Plus} variant="primary" onClick={() => setShowAdd(true)} />} />
      <Loader isLoading={isLoading} isError={isError} />

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
              <Btn type="submit" label="Enregistrer" icon={CheckCircle} variant="primary" loading={editId ? updateMutation.isPending : createMutation.isPending} />
              <Btn label="Annuler" variant="secondary" onClick={handleCloseForm} />
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table
          cols={["Nom", "Téléphone", "Email", "Statut", "Actions"]}
          rows={controleurs.map(c => [
            <div className="flex items-center gap-2" key={`nom-${c.id}`}>
              <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: C.sidebarActive }}>{c.nom[0]}</div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{c.nom}</span>
                {c.invitePending && (
                  <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Invitation en attente</span>
                )}
              </div>
            </div>,
            <span key={`tel-${c.id}`} className="font-mono text-sm">{c.tel}</span>,
            <span key={`email-${c.id}`} className="text-slate-500 text-xs">{c.email}</span>,
            <StatusBadge key={`statut-${c.id}`} statut={c.statut} />,
            <div className="flex gap-1.5 items-center" key={`actions-${c.id}`}>
              <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition-colors" onClick={() => handleOpenEdit(c)} title="Modifier"><Edit size={14} /></button>
              {c.invitePending && (
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-600 transition-colors"
                   onClick={() => handleResendInvitation(c.id)}
                   title="Renvoyer l'email d'invitation"
                   disabled={resendMutation.isPending}>
                   <Mail size={14} className={resendMutation.isPending ? "animate-spin" : ""} />
                </button>
              )}
              <button className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors", c.statut === "Actif" ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600")}
                 onClick={() => handleToggleStatus(c.id, c.statut)}
                 title={c.statut === "Actif" ? "Désactiver" : "Activer"}>
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
