import { useEffect, useRef, useState } from "react";
import { FileDisplay } from "./FileDisplay";
import { getFile } from "../services/api";
import { bytesToLargestUnit } from "../utils/utils";

interface FileDownloadProp {
    code: number;
}

export const FileDownload = ({ code }: FileDownloadProp) => {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0.0);
    const [remaining, setRemaining] = useState("");
    const lastPercent = useRef(-1);

    const downloadFile = async () => {
        let response: Response;
        try {
            response = await getFile(code);
        } catch (e) {
            setStatus(`Could not get fileshare id: ${code}`);
            return;
        }
        setStatus("Processing...");
        const tarballPromise: Promise<File[]> = new Promise(async (res, rej) => {
            const worker = new Worker(new URL("../services/tarballWorker.ts", import.meta.url));
            worker.onmessage = async (event: MessageEvent<File[]>) => {
                res(event.data);
            };
            worker.onerror = (e) => {
                rej(e);
            };
            worker.postMessage({ type: "startOpen", data: null });

            setProgress(0.0);
            let completed = 0;
            const total = Number(response.headers.get("content-length"));
            const reader = response.body?.getReader();
            while (true) {
                const data = await reader?.read();
                if (data?.done || data?.value === undefined) {
                    setProgress(100.0);
                    break;
                }
                completed += data?.value.length;
                const percent = Math.floor((completed / total) * 100);
                if (percent !== lastPercent.current) {
                    lastPercent.current = percent;
                    setProgress(percent);
                    setRemaining(`${bytesToLargestUnit(completed)}/${bytesToLargestUnit(total)}`);
                }
                worker.postMessage({ type: "feedOpen", data: data?.value });
            }
            worker.postMessage({ type: "closeOpen", data: null });
        });

        setFiles(await tarballPromise);
        setStatus("Done");
    };

    useEffect(() => {
        if (code == 0) {
            return;
        }

        setStatus("Downloading...");
        downloadFile();
    }, [code]);

    return (
        <>
            <p>
                {progress}% {remaining}
            </p>
            <p>{status}</p>
            <FileDisplay
                files={files}
                button={(index) => {
                    const url = URL.createObjectURL(files[index]);
                    return (
                        <a href={url} download={files[index].name}>
                            <button>Download</button>
                        </a>
                    );
                }}
            />
        </>
    );
};
