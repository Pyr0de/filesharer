import { useEffect, useRef, useState } from "react";
import { FileDisplay } from "./FileDisplay";
import { getFile } from "../services/api";
import { bytesToLargestUnit } from "../utils/utils";
import { ProgressBar } from "./ProgressBar";

interface FileDownloadProp {
    code: number;
}

interface DownloadProgress {
    current: number;
    total: number;
}

export const FileDownload = ({ code }: FileDownloadProp) => {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState<DownloadProgress>();
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

            let completed = 0;
            const total = Number(response.headers.get("content-length"));
            const reader = response.body?.getReader();
            setProgress({ current: 0, total });

            while (true) {
                const data = await reader?.read();
                if (data?.done || data?.value === undefined) {
                    setProgress({ current: total, total });
                    break;
                }
                completed += data?.value.length;
                const percent = Math.floor((completed / total) * 100);

                if (percent !== lastPercent.current) {
                    lastPercent.current = percent;
                    setProgress({ current: completed, total });
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
            {progress && (
                <ProgressBar
                    current={`${bytesToLargestUnit(progress.current)}`}
                    total={`${bytesToLargestUnit(progress.total)}`}
                    percentage={progress.current / progress.total}
                />
            )}
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
