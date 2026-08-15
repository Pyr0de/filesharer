import type { BaseHTMLAttributes } from "react";
import type { ToastData, ToastTypes } from "../types/toast";
import { twMerge } from "tailwind-merge";

interface ToastProps extends BaseHTMLAttributes<HTMLDivElement> {
    toast: ToastData;
    removeToast: (id: number) => void;
}

const typeStyles: Record<ToastTypes, string> = {
    success: "border-success/40 text-success",
    error: "border-danger/40 text-danger",
    info: "border-accent/40 text-accent",
};

export const Toast = ({ toast, removeToast, className, ...props }: ToastProps) => {
    return (
        <div
            className={twMerge(
                `bg-surface flex items-center justify-between gap-4 rounded-md border px-4 py-3 ${typeStyles[toast.type]} ${className ?? ""}`,
            )}
            {...props}
        >
            <span className="text-sm">{toast.message}</span>
            <button
                onClick={() => removeToast(toast.id)}
                className="cursor-pointer text-base leading-none text-current opacity-70 hover:opacity-100"
                aria-label="Dismiss notification"
            >
                ✕
            </button>
        </div>
    );
};
