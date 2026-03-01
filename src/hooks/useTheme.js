import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState("light"); // light | dark

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const preferred =
      saved ||
      (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
        ? "dark"
        : "light");

    setTheme(preferred);
    document.documentElement.setAttribute("data-theme", preferred);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return { theme, toggleTheme };
}