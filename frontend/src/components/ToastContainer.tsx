import type { Toast } from "../types/toast";
import "./ToastContainer.css"

interface ToastContainerProps {
    toasts: Toast[],
    removeToast: (id: number) => void
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="toast-container">
        {toasts.map((toast) => (
            <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            >
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)}>✕</button>
            </div>
        ))}
        </div>
    );
}
