import type { ToastData } from "../types/toast";
import { Toast } from "./Toast";

interface ToastContainerProps {
    toasts: ToastData[];
    removeToast: (id: number) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-5 right-5 z-[1000] flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    removeToast={removeToast}
                    className="max-w-[360px] min-w-[260px] animate-[slideIn_0.2s_ease]"
                />
            ))}
        </div>
    );
}
