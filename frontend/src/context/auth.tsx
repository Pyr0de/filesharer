import { createContext, useContext, useState, type ReactNode } from "react";
import { getStorageUser, setStorageUser, type User } from "../services/user";
import { useToast } from "./toast";

export interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getStorageUser());
    const { showToast } = useToast();

    const login = (user: User) => {
        showToast("Logged in successfully", "success", 3000);
        setUser(user);
        setStorageUser(user);
    };

    const logout = () => {
        showToast("Logged out successfully", "info", 3000);
        setUser(null);
        setStorageUser(null);
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
