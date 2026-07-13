import { PageHeader, Btn, Card, Table } from "@/app/components/ui/Shared";
import { C, StatusBadge, cn } from "@/app/components/layout/common";
import { Shield, Edit, User, Key, Download, Eye, Plus } from "lucide-react";

export default function ParamsPage({ sub }: { sub: string }) {
  if (sub === "roles") {
    return (
      <div className="p-6">
        <PageHeader title="Rôles & Permissions" subtitle="Gestion des accès et autorisations"
          actions={<Btn label="Nouveau rôle" icon={Plus} variant="primary" />} />
        <div className="grid grid-cols-3 gap-4">
          {[
            { role: "Super Admin", users: 1, desc: "Accès total à toutes les fonctionnalités du système", color: C.purple },
            { role: "Administrateur", users: 3, desc: "Gestion complète sauf sécurité avancée", color: C.ocean },
            { role: "Comptable", users: 2, desc: "Accès aux paiements, wallet et rapports financiers", color: C.amber },
            { role: "Support", users: 2, desc: "Gestion des tickets d'assistance et FAQ", color: "#94a3b8" },
          ].map(r => (
            <Card key={r.role}>
              <div className="flex items-start justify-between mb-3">
                <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: r.color + "18" }}>
                  <Shield size={18} style={{ color: r.color }} />
                </div>
                <button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Edit size={13} /></button>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{r.role}</h3>
              <p className="text-xs text-slate-500 mb-3">{r.desc}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <User size={11} />
                <span>{r.users} utilisateur{r.users > 1 ? "s" : ""}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sub === "agents") {
    return (
      <div className="p-6">
        <PageHeader title="Agents" subtitle="Gestion des agents administratifs"
          actions={<Btn label="Ajouter agent" icon={Plus} variant="primary" />} />
        <Card>
          <Table
            cols={["Agent", "Rôle", "Email", "Téléphone", "Statut", "Dernière connexion", ""]}
            rows={[
              ["Amadou Diallo", "Administrateur", "a.diallo@gogoree.sn", "+221 77 100 11 22", <StatusBadge statut="Actif" />, "11 Jul 2026, 08:30", <div className="flex gap-1"><button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Eye size={14} /></button><button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Edit size={14} /></button></div>],
              ["Ndèye Diop", "Comptable", "n.diop@gogoree.sn", "+221 77 200 33 44", <StatusBadge statut="Actif" />, "11 Jul 2026, 09:15", <div className="flex gap-1"><button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Eye size={14} /></button><button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Edit size={14} /></button></div>],
              ["Moussa Gueye", "Support", "m.gueye@gogoree.sn", "+221 77 300 55 66", <StatusBadge statut="Actif" />, "10 Jul 2026, 17:42", <div className="flex gap-1"><button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Eye size={14} /></button><button className="p-1 rounded hover:bg-slate-100 text-slate-400"><Edit size={14} /></button></div>],
            ]}
          />
        </Card>
      </div>
    );
  }

  if (sub === "api") {
    return (
      <div className="p-6">
        <PageHeader title="API & Intégrations" subtitle="Gestion des clés API et webhooks"
          actions={<Btn label="Générer clé API" icon={Key} variant="primary" />} />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Clés API actives</h3>
            <div className="space-y-3">
              {[
                { name: "Application Mobile", key: "gg_live_sk_••••••••4a9f", statut: "Actif" },
                { name: "Portail Web", key: "gg_live_sk_••••••••8b2e", statut: "Actif" },
                { name: "Reporting", key: "gg_test_sk_••••••••3c1d", statut: "Test" },
              ].map(k => (
                <div key={k.name} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{k.name}</span>
                    <StatusBadge statut={k.statut} />
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded">{k.key}</code>
                    <button className="text-xs font-medium hover:underline" style={{ color: C.ocean }}>Copier</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Webhooks</h3>
            <div className="space-y-3">
              {[
                { url: "https://app.gogoree.sn/webhooks/paiements", events: "payment.success, payment.failed" },
                { url: "https://app.gogoree.sn/webhooks/billets", events: "ticket.created, ticket.validated" },
              ].map((w, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-xs font-mono text-slate-700 truncate max-w-[260px] mb-1">{w.url}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{w.events}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "securite") {
    return (
      <div className="p-6">
        <PageHeader title="Sécurité" subtitle="Configuration de la sécurité du système" />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Authentification</h3>
            <div className="space-y-3">
              {[
                { label: "Authentification à 2 facteurs (2FA)", enabled: true },
                { label: "Alerte de connexion inhabituelle", enabled: true },
                { label: "Blocage après 5 tentatives", enabled: true },
                { label: "Session expirée après 8h", enabled: false },
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
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Sessions actives</h3>
            <div className="space-y-2">
              {[
                { device: "Chrome — Dakar, Sénégal", ip: "41.82.xxx.xxx", time: "Session en cours", current: true },
                { device: "Firefox — Dakar, Sénégal", ip: "41.82.xxx.xxx", time: "Il y a 2 heures", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      {s.device}
                      {s.current && <StatusBadge statut="Actif" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.ip} · {s.time}</div>
                  </div>
                  {!s.current && <button className="text-xs text-red-500 hover:text-red-700 font-medium">Révoquer</button>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "journal") {
    return (
      <div className="p-6">
        <PageHeader title="Journal d'activités" subtitle="Historique de toutes les actions administratives"
          actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
        <Card>
          <Table
            cols={["Date & heure", "Utilisateur", "Action", "Détails", "IP"]}
            rows={[
              ["11 Jul 2026, 10:42", "Admin", "Validation demande résident", "DR-0234 — Mame Diarra Faye", "41.82.xxx"],
              ["11 Jul 2026, 09:30", "Admin", "Modification tarif résident", "800 → 800 FCFA (inchangé)", "41.82.xxx"],
              ["11 Jul 2026, 08:15", "Ndèye Diop", "Export rapport", "rapport_financier_juillet.xlsx", "41.83.xxx"],
              ["10 Jul 2026, 17:55", "Admin", "Modification statut chaloupe", "Augustin Elimane Ly → Maintenance", "41.82.xxx"],
              ["10 Jul 2026, 16:20", "Admin", "Création voyage", "VY-2024-009 planifié", "41.82.xxx"],
            ]}
          />
        </Card>
      </div>
    );
  }

  if (sub === "sauvegardes") {
    const backups = [
      { file: "backup_20260711_0200", label: "11 Jul 2026 — 02:00", age: "Aujourd'hui", size: "2.8 GB" },
      { file: "backup_20260710_0200", label: "10 Jul 2026 — 02:00", age: "Hier", size: "2.8 GB" },
      { file: "backup_20260709_0200", label: "09 Jul 2026 — 02:00", age: "Il y a 2 jours", size: "2.7 GB" },
    ];
    return (
      <div className="p-6">
        <PageHeader title="Sauvegardes" subtitle="Gestion des sauvegardes automatiques et manuelles"
          actions={<Btn label="Sauvegarder maintenant" icon={Download} variant="primary" />} />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Configuration</h3>
            <div className="space-y-1">
              {[
                ["Fréquence automatique", "Quotidienne à 02:00"],
                ["Rétention", "30 jours"],
                ["Stockage cloud", "AWS S3 eu-west-1"],
                ["Chiffrement", "AES-256"],
                ["Prochaine sauvegarde", "12 Jul 2026, 02:00"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-700 last:border-0">
                  <span className="text-sm text-slate-500 shrink-0 mr-4">{k}</span>
                  <span className="text-sm font-semibold text-slate-800 text-right">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Sauvegardes récentes</h3>
            <div className="space-y-2">
              {backups.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-emerald-500"><Shield size={16} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-medium text-slate-700 truncate">
                      gogoree_{b.file}.tar.gz
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{b.size} · {b.age}</div>
                  </div>
                  <button
                    className="text-xs font-semibold shrink-0 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    style={{ color: C.ocean }}
                  >
                    Restaurer
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "tarifs") {
    return (
      <div className="p-6">
        <PageHeader title="Configuration tarifs" subtitle="Règles et paramètres de tarification"
          actions={<Btn label="Sauvegarder" icon={Download} variant="primary" />} />
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Règles de tarification</h3>
          <div className="space-y-3">
            {[
              { label: "Réduction groupe automatique (≥10 pers)", enabled: true },
              { label: "Abonnement mensuel résidents", enabled: true },
              { label: "Gratuité enfants de moins de 3 ans", enabled: true },
              { label: "Tarif préférentiel scolaires", enabled: true },
              { label: "Tarification haute saison (juillet-août)", enabled: false },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700">
                <span className="text-sm text-slate-700 dark:text-slate-300">{r.label}</span>
                <div className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", r.enabled ? "" : "bg-slate-200")}
                  style={r.enabled ? { background: C.ocean } : undefined}>
                  <div className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform", r.enabled ? "translate-x-5" : "translate-x-0.5")} />
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
      <PageHeader title="Paramètres généraux" subtitle="Configuration de base du système"
        actions={<Btn label="Sauvegarder" icon={Download} variant="primary" />} />
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Informations du service</h3>
          <div className="space-y-4">
            {[
              { label: "Nom du service", value: "Go Gorée" },
              { label: "Opérateur", value: "Société de Navigation de Gorée" },
              { label: "Route principale", value: "Dakar Port ↔ Île de Gorée" },
              { label: "Durée de traversée", value: "20 minutes" },
              { label: "Fuseau horaire", value: "Africa/Dakar (UTC+0)" },
              { label: "Devise", value: "Franc CFA (FCFA / XOF)" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
                <input defaultValue={f.value} className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
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
