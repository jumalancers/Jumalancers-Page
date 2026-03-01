import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fontsource-variable/inter";
import "flag-icons/css/flag-icons.min.css";
import { LangProvider } from "./i18n.jsx"; // ajusta ruta si lo guardas en otra carpeta

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>
);