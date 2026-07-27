import { useEffect, useState } from "react";
import { FileDisplay } from "./FileDisplay";
import { getFile } from "../services/api"

interface FileDownloadProp {
    code: number
}

export const FileDownload = ({ code }: FileDownloadProp) => {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState("")

    const downloadFile = async () => {
        let data: Uint8Array;
        try {
            data = await getFile(code)
        }catch (e) {
            setStatus(`Could not get fileshare id: ${code}`)
            return
        }
        setStatus("Processing...")
        const tarballPromise: Promise<File[]> = new Promise((res, rej) => {
            const worker = new Worker(
                new URL("../services/tarballWorker.ts", import.meta.url),
            );
            worker.onmessage = (event: MessageEvent<File[]>) => {
                res(event.data)
            }
            worker.onerror = (e) => {
                rej(e)
            }
            worker.postMessage({type: "open", data })
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
