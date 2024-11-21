import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import style from "./styles/App.module.scss";
import { AppProvider } from "./context/AppContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <div className={style.app}>
        <App />
      </div>
    </AppProvider>
  </StrictMode>
);
