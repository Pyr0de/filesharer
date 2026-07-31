import { useState } from "react";
import { FileDownload, type DownloadProgress } from "../components/FileDownload";
import { Search } from "../components/Search";
import { ProgressBar } from "../components/ProgressBar";
import { bytesToLargestUnit } from "../utils/utils";

export const DownloadPage = () => {
    const [code, setCode] = useState<number>(0);
    const [progress, setProgress] = useState<DownloadProgress>();

    return (
        <>
            {progress && (
                <ProgressBar
                    label="Download"
                    barLabel={`${bytesToLargestUnit(progress.current)}`}
                    rightLabel={`${bytesToLargestUnit(progress.total)}`}
                    percentage={progress.current / progress.total}
                />
            )}
            <FileDownload code={code} setCode={setCode} setProgress={setProgress} />

            <Search setCode={setCode} />
        </>
    );
};
