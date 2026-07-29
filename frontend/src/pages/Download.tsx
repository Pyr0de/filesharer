import { useState } from "react";
import { FileDownload } from "../components/FileDownload";
import { Search } from "../components/Search";

export const DownloadPage = () => {
    const [code, setCode] = useState<number>(0);

    return (
        <>
            <FileDownload code={code} />

            <Search setCode={setCode} />
        </>
    );
};
