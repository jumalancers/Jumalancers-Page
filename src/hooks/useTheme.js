import { useEffect, useState } from "react";

// El sitio es SIEMPRE oscuro (decisión de diseño: "todo oscuro").
// Se mantiene la misma API (theme/toggleTheme) para no romper imports.
export default function useTheme() {
  const [theme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }, []);

  // Toggle deshabilitado a propósito; el sitio se queda oscuro.
  const toggleTheme = () => {};

  return { theme, toggleTheme };
}
