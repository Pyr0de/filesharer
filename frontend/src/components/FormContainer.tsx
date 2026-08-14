import type { FormHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode;
}

export const FormContainer = ({ children, className, ...props }: FormContainerProps) => {
    return (
        <div className="flex h-[100%] items-center justify-center">
            <form
                className={twMerge(
                    `bg-surface-raised border-border flex flex-col justify-center gap-3 rounded-lg border px-4 py-6 ${className ?? ""}`,
                )}
                {...props}
            >
                {children}
            </form>
        </div>
    );
};
