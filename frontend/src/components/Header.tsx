import { NavLink } from "react-router-dom";
import { ToggleButton } from "./ToggleButton";
import { useState, useEffect } from "react";

export function Header() {
    const stored_theme = localStorage.getItem("filesharer-theme");
    const [theme, setTheme] = useState(stored_theme == null ? "dark" : stored_theme);
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("filesharer-theme", theme);
    }, [theme]);

    const onToggle = (state: boolean) => {
        setTheme(state ? "light" : "dark");
    };
    return (
        <header className="bg-surface border-border sticky top-0 z-50 flex items-center border-b backdrop-blur">
            <nav className="flex items-center gap-6 px-6 py-4">
                <span className="font-display text-accent mr-4 text-lg font-semibold tracking-tight">
                    FileSharer
                </span>

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `font-body text-sm transition-colors ${
                            isActive ? "text-accent" : "text-neutral-400 hover:text-neutral-100"
                        }`
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/download"
                    className={({ isActive }) =>
                        `font-body text-sm transition-colors ${
                            isActive ? "text-accent" : "text-neutral-400 hover:text-neutral-100"
                        }`
                    }
                >
                    Download
                </NavLink>
            </nav>
            <ToggleButton className="mx-10 ml-auto" value={theme == "light"} setValue={onToggle} />
        </header>
    );
}
