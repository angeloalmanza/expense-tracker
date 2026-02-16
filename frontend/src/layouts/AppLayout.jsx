import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logout effettuato");
    } catch {
      toast.error("Errore durante il logout");
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen app-shell">
      <Toaster position="top-right" />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-lg btn-soft transition-colors cursor-pointer"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {user && (
              <div className="flex items-center gap-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.name}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="h-9 px-3 flex items-center gap-2 rounded-lg btn-soft transition-colors cursor-pointer disabled:opacity-60 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">
                {loggingOut ? "Uscita..." : "Logout"}
              </span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
