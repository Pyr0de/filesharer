import { useEffect, useRef, useState } from "react";
import { FileDisplay } from "./FileDisplay";
import { getFile } from "../services/api";
import { useToast } from "../context/toast";

interface FileDownloadProp {
    code: number;
    setCode: (code: number) => void;
    setProgress: (progress: DownloadProgress) => void;
}

export interface DownloadProgress {
    current: number;
    total: number;
}

export const FileDownload = ({ code, setCode, setProgress }: FileDownloadProp) => {
    const [files, setFiles] = useState<File[]>([]);
    const { showToast } = useToast();
    const lastPercent = useRef(-1);

    const downloadFile = async () => {
        let response: Response;
        try {
            response = await getFile(code);
        } catch (e) {
            showToast(`Could not get fileshare id: ${code}`, "error", 3000);
            setCode(0);
            return;
        }
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
    };

    useEffect(() => {
        if (code == 0) {
            return;
        }

        downloadFile();
    }, [code]);

    if (files.length == 0) {
        return <></>;
    }

    return (
        <div className="bg-surface border-border bg-void text-accent m-4 rounded-lg border px-4 py-5">
            <FileDisplay
                files={files}
                button={(index) => {
                    const url = URL.createObjectURL(files[index]);
                    return (
                        <a href={url} download={files[index].name} className="">
                            <button className="cursor-pointer">Download</button>
                        </a>
                    );
                }}
                addFileButton={undefined}
            />
        </div>
    );
};
