import { useState, useEffect } from "react";
import { AuthContext } from "./auth";
import { useAuthStore } from "./store/authStore";
import AppRoutes from "./routes/AppRoutes";

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
      <AppRoutes darkMode={darkMode} onDark={setDarkMode} />
    </AuthContext.Provider>
  );
}
