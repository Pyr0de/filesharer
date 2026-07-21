import { useEffect, useState } from "react";
import { FileDisplay } from "./FileDisplay";

interface FileDownloadProp {
    code: number
}

export const FileDownload = ({ code }: FileDownloadProp) => {
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        // Download new tar file from api
        console.log("hello")
    }, [code])

    const onDownload = (index: number) => {
        // Download individual file
        console.log(`Downloading ${index}`)
    }

    return (
        <>
            <FileDisplay files={files} button={(index) => {
                return <button onClick={() => onDownload(index)}>Download</button>
            }} />
        </>
    )
}
