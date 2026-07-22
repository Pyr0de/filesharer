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

    }

    useEffect(() => {
        downloadFile()
    }, [code])

    const onDownload = (index: number) => {
        // Download individual file
        console.log(`Downloading ${index}`)
    }

    return (
        <>
            {status != "" && <p>{status}</p>}
            <FileDisplay files={files} button={(index) => {
                return <button onClick={() => onDownload(index)}>Download</button>
            }} />
        </>
    )
}
