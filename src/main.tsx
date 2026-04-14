import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/init";
import App from "./App.tsx";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { GlobalErrorListener } from "./components/shared/GlobalErrorListener";
import { AuthBootstrap } from "./components/shared/AuthBootstrap";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <GlobalErrorListener>
        <AuthBootstrap>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthBootstrap>
      </GlobalErrorListener>
    </ErrorBoundary>
  </StrictMode>,
);
