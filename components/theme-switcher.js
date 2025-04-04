import { useState, useEffect } from "react";

const themes = [
  "retro",
  "dark",
  "light",
  "dracula",
  "cyberpunk",
  "synthwave",
  "valentine",
  "business",
  "forest",
  "luxury",
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("retro");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "retro";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  if (!mounted) return null; 

  return (
    <div className="fixed top-4 right-4 p-3 bg-base-200 rounded-lg shadow-lg">
      <label className="text-lg font-bold mr-2">🎨 Theme:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="select select-bordered"
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
