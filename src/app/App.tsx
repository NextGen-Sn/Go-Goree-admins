import { useState, useEffect } from "react";
import { AuthContext } from "./auth";
import { useAuthStore } from "./store/authStore";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

export default function App() {
  const { isLoggedIn, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login: () => {}, // LoginPage utilise useAuthStore directement
        logout: () => logout(),
      }}
    >
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { padding: '20px', fontSize: '16px', fontWeight: 'bold' },
          classNames: {
            toast: 'rounded-xl shadow-2xl border-0',
            success: 'bg-emerald-500 text-white',
            error: 'bg-rose-500 text-white',
            warning: 'bg-amber-500 text-white',
            info: 'bg-blue-500 text-white',
          }
        }}
      />
      <AppRoutes darkMode={darkMode} onDark={setDarkMode} />
    </AuthContext.Provider>
  );
}
