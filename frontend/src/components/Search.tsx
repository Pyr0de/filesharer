import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/toast";

interface SearchProp {
    setCode: (code: number) => void;
}

export const Search = ({ setCode }: SearchProp) => {
    const [codeText, setCodeText] = useState("");
    const location = useLocation();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const onClick = () => {
        let text = codeText.trim();
        navigate({
            pathname: location.pathname,
            search: `?code=${text}`,
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const url_code = params.get("code");
        if (url_code == null) {
            return;
        }
        setCodeText(url_code);
        if (!/^\d{6}$/.test(url_code)) {
            showToast(`Invalid code: ${url_code}`, "error", 3000);
            return;
        }
        setCode(+url_code);
    }, [location]);

    return (
        <div className="flex w-full items-center justify-center gap-3 p-5 bg-surface-raised">
            <input
                type="search"
                inputMode="numeric"
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                className="border-border bg-surface text-accent focus:ring-accent-dim h-12 w-48 rounded-lg border text-center font-mono text-xl font-semibold tracking-[0.4em] transition outline-none focus:ring-2"
                placeholder="000000"
            />
            <button
                onClick={onClick}
                className="bg-accent text-void h-12 cursor-pointer rounded-lg border-0 px-5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
                Download
            </button>
        </div>
    );
};
