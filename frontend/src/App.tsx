import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/Home'
import { DownloadPage } from './pages/Download';

export default function App() {
    if (!window.location.hash) {
        window.location.replace(`/#${window.location.pathname}${window.location.search}`);
    }
    return (
        <HashRouter>
        <Routes>
            <Route path="/*" element={<p>404 Page not found</p>} />
            <Route path="/" element={<HomePage />} />
            <Route path="/download" element={<DownloadPage />} />
            </Routes>
        </HashRouter>
    )
}
