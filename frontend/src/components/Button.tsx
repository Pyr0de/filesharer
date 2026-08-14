import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
}

export const Button = ({ children, type = "button", className, ...props }: ButtonProps) => {
    const classes = twMerge(
        ` bg-accent text-void px-4 py-2.5 cursor-pointer rounded-lg border-0 text-sm font-semibold transition-opacity hover:opacity-90 ${className ?? ""} `,
    );
    return (
        <button className={classes} type={type} {...props}>
            {children}
        </button>
    );
};
