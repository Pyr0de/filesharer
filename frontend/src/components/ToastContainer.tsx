import type { Toast, ToastTypes } from "../types/toast";

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: number) => void;
}

const typeStyles: Record<ToastTypes, string> = {
    success: "border-success/40 text-success",
    error: "border-danger/40 text-danger",
    info: "border-accent/40 text-accent",
};

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-5 right-5 z-[1000] flex flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`bg-surface flex max-w-[360px] min-w-[260px] items-center justify-between gap-4 rounded-md border px-4 py-3 ${typeStyles[toast.type]} animate-[slideIn_0.2s_ease]`}
                >
                    <span className="text-sm">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-base leading-none text-current opacity-70 hover:opacity-100"
                        aria-label="Dismiss notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
