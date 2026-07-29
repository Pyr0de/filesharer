import { NavLink } from 'react-router-dom';

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-void/95 backdrop-blur border-b border-border">
            <nav className="flex items-center gap-6 px-6 py-4  mx-auto">
                
            <span className="font-display font-semibold text-accent text-lg tracking-tight mr-4">
            FileSharer
            </span>

            <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    `font-body text-sm transition-colors ${
                    isActive ? 'text-accent' : 'text-neutral-400 hover:text-neutral-100'
                    }`
                }
            >Home</NavLink>

        <NavLink
        to="/download"
        className={({ isActive }) =>
            `font-body text-sm transition-colors ${
                isActive ? 'text-accent' : 'text-neutral-400 hover:text-neutral-100'
            }`
        }
        >Download</NavLink>
        
        </nav>
        </header>
    );
}
