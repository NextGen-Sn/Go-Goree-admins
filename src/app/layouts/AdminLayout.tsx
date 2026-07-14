import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import { getEcho, resetEcho } from "../api/echo";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminLayout({ darkMode, onDark }: { darkMode: boolean; onDark: (v: boolean) => void }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !user.id) return;

    try {
      // Initialiser la connexion Echo
      const echo = getEcho();

      // S'abonner au canal privé de l'administrateur connecté
      const channelName = `App.Models.User.${user.id}`;
      
      echo.private(channelName)
        .listen(".notification.creee", (data: any) => {
          // Afficher la notification temps réel sous forme de Toast
          toast.info(data.message, {
            duration: 8000,
            description: "Notification administrative en temps réel (Reverb)",
          });

          // Rafraîchir les compteurs et données en cache dans l'application
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard", "analytics"] });
          queryClient.invalidateQueries({ queryKey: ["residents"] });
        });

      return () => {
        echo.leave(channelName);
        resetEcho();
      };
    } catch (err) {
      console.error("Erreur de connexion WebSocket Reverb :", err);
    }
  }, [user, queryClient]);

  return (
    <div className="flex h-screen overflow-hidden dark:bg-background" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "#EFF3F9" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar darkMode={darkMode} onDark={onDark} />
        <main className="flex-1 overflow-y-auto dark:bg-background" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
