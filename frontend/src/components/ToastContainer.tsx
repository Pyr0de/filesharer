import type { Toast, ToastTypes } from "../types/toast";

interface ToastContainerProps {
    toasts: Toast[],
    removeToast: (id: number) => void
}

const typeStyles: Record<ToastTypes, string> = {
  success: 'border-success/40 text-success',
  error: 'border-danger/40 text-danger',
  info: 'border-accent/40 text-accent',
};

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-5 right-5 flex flex-col gap-3 z-[1000]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={
              `min-w-[260px] max-w-[360px] px-4 py-3
              rounded-md flex items-center justify-between gap-4
              bg-surface border ${typeStyles[toast.type]}
              animate-[slideIn_0.2s_ease]`
          }>
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100 text-current text-base leading-none"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
