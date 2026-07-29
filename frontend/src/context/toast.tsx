import React, { createContext, useContext, useRef, useState } from "react";
import type { Toast, ToastTypes } from "../types/toast";
import ToastContainer from "../components/ToastContainer";

type ToastContextType = {
    showToast: (message: string, type: ToastTypes, duration: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const currentId = useRef(0);

    const showToast = (message: string, type: ToastTypes = "info", duration: number = 3000) => {
        const id = currentId.current;
        currentId.current += 1;

        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}
