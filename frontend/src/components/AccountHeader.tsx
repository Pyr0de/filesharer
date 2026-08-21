import type { HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../context/auth";

interface AccountHeaderProps extends HTMLAttributes<HTMLElement> {}

export const AccountHeader = ({ className, ...props }: AccountHeaderProps) => {
    const { user, logout } = useAuth();

    if (user) {
        return (
            <div className={twMerge(`flex items-center ${className ?? ""}`)} {...props}>
                <p className="font-body text-text text-sm">{user.username}</p>
                <a
                    className="font-body text-accent cursor-pointer text-sm transition-colors hover:text-neutral-100"
                    onClick={logout}
                >
                    Logout
                </a>
            </div>
        );
    }

    return (
        <nav className={twMerge(`flex items-center ${className ?? ""}`)} {...props}>
            <NavLink
                to="/login"
                className="font-body text-accent text-sm transition-colors hover:text-neutral-100"
            >
                Login
            </NavLink>
            <NavLink
                to="/signup"
                className="font-body text-accent text-sm transition-colors hover:text-neutral-100"
            >
                Signup
            </NavLink>
        </nav>
    );
};
