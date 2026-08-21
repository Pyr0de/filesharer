import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/space-grotesk";
import "@fontsource/inter";
import App from "./App.tsx";
import { ToastProvider } from "./context/toast.tsx";
import { AuthProvider } from "./context/auth.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ToastProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ToastProvider>
    </StrictMode>,
);
