import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home";
import { DownloadPage } from "./pages/Download";
import { Header } from "./components/Header";
import { NotFound } from "./pages/404";

export default function App() {
    return (
        <HashRouter>
            <section className="flex h-[100vh] flex-col">
                <Header />
                <Routes>
                    <Route path="/*" element={<NotFound />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/download" element={<DownloadPage />} />
                </Routes>
            </section>
        </HashRouter>
    );
}
