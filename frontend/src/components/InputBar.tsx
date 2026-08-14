import type { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputBarProps extends InputHTMLAttributes<HTMLInputElement> {
    type: "text" | "search" | "password" | "email";
}

export const InputBar = ({ className, ...props }: InputBarProps) => {
    return (
        <input
            className={twMerge(
                `border-border bg-surface text-accent focus:ring-accent-dim rounded-lg border p-1 font-semibold transition outline-none focus:ring-2 ${className ?? ""} `,
            )}
            {...props}
        />
    );
};
