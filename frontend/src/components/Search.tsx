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
        <>
            <input type="search" value={codeText} onChange={(e) => setCodeText(e.target.value)} />
            <button onClick={onClick}>Download</button>
        </>
    );
};
