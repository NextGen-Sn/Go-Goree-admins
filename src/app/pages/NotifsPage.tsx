import { useState } from "react";
import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { Smartphone, Mail, Bell, MessageSquare, Send, BellRing, Download } from "lucide-react";
import { useNotifications, useBroadcastNotification } from "@/app/hooks/notifications/useNotifications";
import { toast } from "sonner";

export default function NotifsPage({ sub }: { sub: string }) {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const broadcastMutation = useBroadcastNotification();

  const [message, setMessage] = useState("");
  const [canal, setCanal] = useState("IN_APP"); // Default to IN_APP (in app + real-time reverb)
  const [titre, setTitre] = useState("");

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

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      toast.error("Veuillez saisir un message.");
      return;
    }

    try {
      const fullMessage = titre ? `[${titre}] ${message}` : message;
      await broadcastMutation.mutateAsync({
        canal: canal.toUpperCase(),
        message: fullMessage,
      });
      toast.success("Campagne de notification diffusée avec succès !");
      setMessage("");
      setTitre("");
    } catch (err) {
      toast.error("Impossible de diffuser la notification.");
    }
  };

  const handleUseTemplate = (title: string, msg: string) => {
    setTitre(title);
    setMessage(msg);
    toast.success("Modèle de notification appliqué.");
  };

  if (sub === "envoyer") {
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Envoyer une notification" subtitle="Communiquer avec les passagers" />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <form onSubmit={handleBroadcast}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Composer le message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Canal de diffusion principal</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: "In-App / Temps réel", key: "IN_APP", icon: MessageSquare },
                      { label: "Email", key: "EMAIL", icon: Mail },
                      { label: "SMS", key: "SMS", icon: Smartphone },
                    ].map(item => (
                      <button type="button" key={item.key} onClick={() => setCanal(item.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${
                          canal === item.key 
                            ? "border-blue-600 bg-blue-50 text-blue-700" 
                            : "border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                        }`}>
                        <item.icon size={13} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Titre</label>
                  <input className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800"
                    placeholder="Ex: Alerte embarquement" value={titre} onChange={e => setTitre(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Message</label>
                  <textarea className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none resize-none bg-white dark:bg-slate-800"
                    rows={5} placeholder="Rédigez votre message ici..." value={message} onChange={e => setMessage(e.target.value)} required />
                </div>
                <button type="submit" disabled={broadcastMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors">
                  <Send size={13} /> Diffuser la notification
                </button>
              </div>
            </form>
          </Card>
          
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Modèles prédéfinis</h3>
            <div className="space-y-2">
              {[
                { titre: "Voyage annulé", desc: "Notification d'annulation avec information de remboursement", msg: "Alerte : Le voyage de 17h00 est annulé en raison des conditions météorologiques. Remboursement automatique sur votre portefeuille." },
                { titre: "Retard de traversée", desc: "Information de délai pour le prochain voyage", msg: "Info : Le départ de la chaloupe Coumba Castel de 10h est retardé de 15 minutes." },
                { titre: "Promo résidents", desc: "Offre spéciale abonnement mensuel résidents", msg: "Bonne nouvelle : Pensez à renouveler votre abonnement mensuel pour continuer à voyager sans limite !" },
                { titre: "Rappel embarquement", desc: "Rappel avant le départ du voyage", msg: "Rappel : Embarquement en cours pour le départ de 16h00. Veuillez vous présenter aux portillons." },
              ].map((t, i) => (
                <button key={i} onClick={() => handleUseTemplate(t.titre, t.msg)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left">
                  <BellRing size={16} className="mt-0.5 shrink-0" style={{ color: C.ocean }} />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.titre}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "historique") {
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Historique des notifications" subtitle="Toutes les communications envoyées"
          actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
        <Card>
          <Table
            cols={["Date", "Canal", "Destinataires", "Message", "Statut"]}
            rows={notifications.map(n => [
              <span key={`date-${n.id}`}>{n.date}</span>,
              <Badge key={`canal-${n.id}`} label={n.canal} color={n.canal === "SMS" ? "blue" : n.canal === "EMAIL" ? "teal" : "purple"} />,
              <span key={`dest-${n.id}`}>{n.destinataires}</span>,
              <span key={`msg-${n.id}`} className="text-xs truncate max-w-sm block" title={n.message}>{n.message}</span>,
              <StatusBadge key={`stat-${n.id}`} statut="Validé" />,
            ])}
          />
        </Card>
      </div>
    );
  }

  const labels: Record<string, string> = { sms: "SMS", email: "Email", push: "Notifications Push", inapp: "In-App" };
  const canalFilter = sub.toUpperCase();

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title={`Canal — ${labels[sub] ?? sub}`} subtitle="Statistiques et historique du mois" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[ 
          ["Envoyés (mois)", notifications.filter(n => n.canal === canalFilter).length, C.ocean], 
          ["Délivrés", notifications.filter(n => n.canal === canalFilter).length, C.teal], 
          ["Taux d'ouverture", "100%", C.green], 
          ["Échecs", "0", C.red] 
        ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-4">
            <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
            <div className="text-xs text-slate-500 mt-1">{l as string}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Table
          cols={["Date", "Destinataires", "Message", "Statut"]}
          rows={notifications.filter(n => n.canal === canalFilter).map(n => [
            <span key={`date-${n.id}`}>{n.date}</span>,
            <span key={`dest-${n.id}`}>{n.destinataires}</span>,
            <span key={`msg-${n.id}`} className="text-xs truncate max-w-lg block" title={n.message}>{n.message}</span>,
            <StatusBadge key={`stat-${n.id}`} statut="Validé" />,
          ])}
        />
      </Card>
    </div>
  );
}
