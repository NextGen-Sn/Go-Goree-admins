import { useState, useEffect } from "react";
import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, StatusBadge, cn } from "@/app/components/layout/common";
import { Shield, User, Key, Trash2, X, Clipboard, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { laravelClient } from "@/app/api/laravelClient";
import { 
  useSettings, 
  useUpdateSettings, 
  useActivityLogs, 
  useTokens, 
  useCreateToken, 
  useDeleteToken 
} from "@/app/hooks/settings/useSettings";
import { toast } from "sonner";

export default function ParamsPage({ sub }: { sub: string }) {
  // Query all users to count by role dynamically
  const { data: allUsers = [] } = useQuery({
    queryKey: ["all-users-settings"],
    queryFn: async () => {
      const res = await laravelClient.get("/v1/users");
      return Array.isArray(res.data) ? res.data : (res.data.data || []);
    }
  });

  const { data: settings = {} } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const { data: logsData } = useActivityLogs();
  const logs = logsData?.data || [];

  const { data: tokens = [] } = useTokens();
  const createTokenMutation = useCreateToken();
  const deleteTokenMutation = useDeleteToken();

  // General Settings inputs
  const [serviceName, setServiceName] = useState("Go Gorée");
  const [operator, setOperator] = useState("Société de Navigation de Gorée");
  const [route, setRoute] = useState("Dakar Port ↔ Île de Gorée");
  const [duration, setDuration] = useState("20 minutes");
  const [timezone, setTimezone] = useState("Africa/Dakar (UTC+0)");
  const [currency, setCurrency] = useState("Franc CFA (FCFA / XOF)");

  // Tokens states
  const [newTokenName, setNewTokenName] = useState("");
  const [plainToken, setPlainToken] = useState<string | null>(null);

  // Sync general settings from loaded data
  useEffect(() => {
    if (settings.serviceName) setServiceName(settings.serviceName);
    if (settings.operator) setOperator(settings.operator);
    if (settings.route) setRoute(settings.route);
    if (settings.duration) setDuration(settings.duration);
    if (settings.timezone) setTimezone(settings.timezone);
    if (settings.currency) setCurrency(settings.currency);
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        serviceName,
        operator,
        route,
        duration,
        timezone,
        currency
      });
      toast.success("Paramètres généraux sauvegardés avec succès.");
    } catch (err) {
      toast.error("Erreur de sauvegarde des paramètres.");
    }
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName) return;
    try {
      const res = await createTokenMutation.mutateAsync(newTokenName);
      setPlainToken(res.plain_text_token);
      setNewTokenName("");
      toast.success("Clé API générée avec succès.");
    } catch (err) {
      toast.error("Erreur lors de la création de la clé API.");
    }
  };

  const handleDeleteToken = async (id: string | number) => {
    if (confirm("Révoquer définitivement cette clé d'accès ?")) {
      try {
        await deleteTokenMutation.mutateAsync(id);
        toast.success("Accès révoqué.");
      } catch (err) {
        toast.error("Erreur de révocation.");
      }
    }
  };

  if (sub === "roles") {
    return (
      <div className="p-6">
        <PageHeader title="Rôles & Permissions" subtitle="Gestion des accès et autorisations" />
        <div className="grid grid-cols-3 gap-4">
          {[
            { role: "Super Admin", count: allUsers.filter((u: any) => u.role?.nom === "SuperAdmin").length || 1, desc: "Accès total à toutes les fonctionnalités du système", color: C.purple },
            { role: "Administrateur", count: allUsers.filter((u: any) => u.role?.nom === "Admin").length || 3, desc: "Gestion complète sauf sécurité avancée", color: C.ocean },
            { role: "Agent", count: allUsers.filter((u: any) => u.role?.nom === "Agent").length || 2, desc: "Scan de billets et ouverture d'embarcations", color: C.amber },
          ].map(r => (
            <Card key={r.role}>
              <div className="flex items-start justify-between mb-3">
                <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: r.color + "18" }}>
                  <Shield size={18} style={{ color: r.color }} />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{r.role}</h3>
              <p className="text-xs text-slate-500 mb-3">{r.desc}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <User size={11} />
                <span>{r.count} utilisateur{r.count > 1 ? "s" : ""}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sub === "agents") {
    const agentsList = allUsers.filter((u: any) => u.role?.nom === "Admin" || u.role?.nom === "Agent" || u.role?.nom === "SuperAdmin");

    return (
      <div className="p-6">
        <PageHeader title="Agents" subtitle="Gestion des agents et administrateurs de la plateforme" />
        <Card>
          <Table
            cols={["Nom", "Rôle", "Email", "Téléphone", "Statut"]}
            rows={agentsList.map((u: any) => [
              <span className="font-semibold text-slate-800" key={`nom-${u.id}`}>{u.prenom} {u.nom}</span>,
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-medium" key={`role-${u.id}`}>{u.role?.nom}</span>,
              <span className="text-xs text-slate-500" key={`email-${u.id}`}>{u.email}</span>,
              <span className="text-xs text-slate-500 font-mono" key={`tel-${u.id}`}>{u.telephone || "—"}</span>,
              <StatusBadge statut={u.active ? "Actif" : "Inactif"} key={`stat-${u.id}`} />,
            ])}
          />
        </Card>
      </div>
    );
  }

  if (sub === "api") {
    return (
      <div className="p-6">
        <PageHeader title="API & Clés d'Accès" subtitle="Gestion des jetons de connexion et webhooks" />
        
        {plainToken && (
          <Card className="mb-6 border-2 border-emerald-300 bg-emerald-50/20 max-w-xl">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-emerald-800">Nouvelle Clé API Générée</h4>
              <button onClick={() => setPlainToken(null)}><X size={14} /></button>
            </div>
            <p className="text-xs text-slate-600 mb-3">Veuillez copier cette clé maintenant. Pour des raisons de sécurité, elle ne sera plus affichée par la suite.</p>
            <div className="flex gap-2">
              <code className="flex-1 p-2 bg-white border border-emerald-200 rounded text-xs font-mono select-all break-all">{plainToken}</code>
              <button 
                onClick={() => { navigator.clipboard.writeText(plainToken); toast.success("Clé copiée !"); }}
                className="px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs flex items-center gap-1 font-semibold"
              >
                Copier
              </button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Générer une clé API</h3>
            <form onSubmit={handleCreateToken} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nom de l'application / Usage</label>
                <input 
                  value={newTokenName} 
                  onChange={e => setNewTokenName(e.target.value)}
                  placeholder="Ex: Application Mobile Scanner" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  required 
                />
              </div>
              <Btn label="Créer la clé d'accès" icon={Key} variant="primary" type="submit" />
            </form>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Clés API actives</h3>
            <div className="space-y-3">
              {tokens.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 text-center">Aucune clé API active</div>
              ) : (
                tokens.map((k: any) => (
                  <div key={k.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{k.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">Dernière utilisation: {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString("fr-FR") : "Jamais"}</div>
                    </div>
                    <button onClick={() => handleDeleteToken(k.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Révoquer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "journal") {
    return (
      <div className="p-6">
        <PageHeader title="Journal d'activités" subtitle="Historique de toutes les actions administratives" />
        <Card>
          <Table
            cols={["Date & heure", "Utilisateur", "Action", "Détails", "IP"]}
            rows={logs.map((log: any) => [
              <span className="font-mono text-xs text-slate-500" key={`date-${log.id}`}>{new Date(log.created_at).toLocaleString("fr-FR")}</span>,
              <span className="font-semibold text-slate-800" key={`user-${log.id}`}>{log.user_name}</span>,
              <span className="font-semibold text-blue-700" key={`act-${log.id}`}>{log.action}</span>,
              <span className="text-xs text-slate-600" key={`det-${log.id}`}>{log.details || "—"}</span>,
              <span className="font-mono text-xs text-slate-400" key={`ip-${log.id}`}>{log.ip_address}</span>,
            ])}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Paramètres généraux" subtitle="Configuration de base du service"
        actions={<Btn label="Sauvegarder" icon={CheckCircle} variant="primary" onClick={handleSaveSettings} />} />
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Informations du service</h3>
          <div className="space-y-4">
            {[
              { label: "Nom du service", value: serviceName, setter: setServiceName },
              { label: "Opérateur", value: operator, setter: setOperator },
              { label: "Route principale", value: route, setter: setRoute },
              { label: "Durée de traversée", value: duration, setter: setDuration },
              { label: "Fuseau horaire", value: timezone, setter: setTimezone },
              { label: "Devise", value: currency, setter: setCurrency },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
                <input 
                  value={f.value} 
                  onChange={e => f.setter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" 
                />
              </div>
            ))}
          </div>
        </Card>
        
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Alertes système</h3>
          <div className="space-y-3">
            {[
              { label: "Alerte capacité ≥ 90%", enabled: true },
              { label: "Rapport mensuel automatique", enabled: true },
              { label: "Alerte paiement échoué", enabled: true },
              { label: "Notification demande résident", enabled: true },
              { label: "Rappel maintenance chaloupe", enabled: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700">
                <span className="text-sm text-slate-700 dark:text-slate-300">{s.label}</span>
                <div className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", s.enabled ? "" : "bg-slate-200")}
                  style={s.enabled ? { background: C.ocean } : undefined}>
                  <div className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform", s.enabled ? "translate-x-5" : "translate-x-0.5")} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
