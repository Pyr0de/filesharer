import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home";
import { DownloadPage } from "./pages/Download";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";

export default function App() {
    return (
        <HashRouter>
            <section className="flex h-[100vh] flex-col">
                <Header />
                <Routes>
                    <Route path="/*" element={<p>404 Page not found</p>} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/download" element={<DownloadPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </section>
        </HashRouter>
    );
}
