import { Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

export default function AdminLayout({ darkMode, onDark }: { darkMode: boolean; onDark: (v: boolean) => void }) {
  const location = useLocation();
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
