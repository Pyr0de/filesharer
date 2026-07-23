import { useEffect, useState } from "react";
import { FileDisplay } from "./FileDisplay";
import { getFile } from "../services/api"

interface FileDownloadProp {
    code: number
}

type DataMap = {
    files: File[];
};

type WorkerMessage<T extends keyof DataMap = keyof DataMap> = {
    type: T;
    data: DataMap[T];
};

export const FileDownload = ({ code }: FileDownloadProp) => {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState("")

    const downloadFile = async () => {
        let response: Response
        try {
            response = await getFile(code)
        }catch (e) {
            setStatus(`Could not get fileshare id: ${code}`)
            return
        }
        setStatus("Processing...")
        const tarballPromise: Promise<File[]> = new Promise(async (res, rej) => {
            const worker = new Worker(
                new URL("../services/tarballWorker.ts", import.meta.url),
            );
            worker.onmessage = async (event: MessageEvent<WorkerMessage>) => {
                res(event.data.data)
            }
            worker.onerror = (e) => {
                rej(e)
            }
            worker.postMessage({type: "startOpen", data: null})

            const reader = response.body?.getReader()
            while (true) {
                const data = await reader?.read()
                if (data?.done || data?.value === undefined) {
                    break
                }
                worker.postMessage({type: "feedOpen", data: data?.value})
            }
            worker.postMessage({type: "closeOpen", data: null})
        })

        setFiles(await tarballPromise)
        setStatus("Done")
    }

    useEffect(() => {
        if (code == 0) {
            return
        }

        setStatus("Downloading...")
        downloadFile()
    }, [code])

    return (
        <>
            <p>{status}</p>
            <FileDisplay files={files} button={(index) => {
                const url = URL.createObjectURL(files[index])
                return (
                    <a href={url} download={files[index].name}>
                    <button>Download</button>
                    </a>
                )
            }} />
        </>
    )
}
