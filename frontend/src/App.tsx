import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home";
import { DownloadPage } from "./pages/Download";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { useAuth } from "./context/auth";

export default function App() {
    const { user } = useAuth();

    return (
        <HashRouter>
            <section className="flex h-[100vh] flex-col">
                <Header />
                <Routes>
                    <Route path="/*" element={<p>404 Page not found</p>} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/download" element={<DownloadPage />} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
                    <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
                </Routes>
            </section>
        </HashRouter>
    );
}
