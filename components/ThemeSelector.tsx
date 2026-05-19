"use client";

import { Palette } from "lucide-react";
import { useTheme, type DaisyTheme } from "@/components/ThemeProvider";

export function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "w-full sm:w-auto"}`}>
      <Palette className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
      <label className="sr-only" htmlFor="theme-select">
        Choose app theme
      </label>
      <select
        id="theme-select"
        className={`select select-bordered select-sm ${compact ? "max-w-[9rem]" : "w-full min-w-[10rem]"}`}
        value={theme}
        onChange={(e) => setTheme(e.target.value as DaisyTheme)}
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}



