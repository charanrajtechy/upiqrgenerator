import { Moon, Sun, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import SettingsPage from "./SettingsPage";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setDark((d) => !d)}
          className="p-2.5 rounded-full bg-card border border-border shadow-card hover:shadow-card-hover transition-all"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2.5 rounded-full bg-card border border-border shadow-card hover:shadow-card-hover transition-all"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <SettingsPage open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default ThemeToggle;
