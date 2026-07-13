import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/WhatsApp_Image_2026-07-12_at_00.36.06.jpeg";
import { C } from "@/app/components/layout/common";
import { useAuthStore } from "@/app/store/authStore";

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Veuillez remplir tous les champs.");
    setLoading(true);
    try {
      await login(email, password);
      const dest = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
      navigate(dest, { replace: true });
    } catch (err) {
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* ── Left brand panel ── */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 p-12 text-white"
        style={{ background: C.sidebarActive }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-white/30">
            <ImageWithFallback src={logoImg} alt="Go Gorée" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">GO GORÉE</div>
            <div className="text-xs text-white/70">Administration</div>
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-3xl font-bold leading-tight">Gérez la liaison Dakar ↔ Gorée en toute simplicité</h1>
          <p className="text-white/80 max-w-md">
            La plateforme tout-en-un pour piloter vos traversées, billets, contrôleurs et recettes — en temps réel, depuis Dakar ou l'île de Gorée.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold font-mono">12 280</div>
            <div className="text-xs text-white/70 mt-1">Billets ce mois</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">94%</div>
            <div className="text-xs text-white/70 mt-1">Taux d'occupation</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">61,4 M</div>
            <div className="text-xs text-white/70 mt-1">Recettes (FCFA)</div>
          </div>
        </div>
      </div>

      {/* ── Right login form ── */}
      <div className="flex flex-1 items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <ImageWithFallback src={logoImg} alt="Go Gorée" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">GO GORÉE</div>
              <div className="text-xs text-slate-400">Administration</div>
            </div>
          </div>

          <label className="block text-xs text-slate-500 mb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 mb-3 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100" />

          <label className="block text-xs text-slate-500 mb-1">Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 mb-4 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100" />

          {error && <div className="text-xs text-red-600 mb-3">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-white" style={{ background: C.sidebarActive }}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
