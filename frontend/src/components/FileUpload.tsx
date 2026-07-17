import { type ChangeEvent, useState, useEffect } from "react";
import { FileDisplay } from "./FileDisplay";
import { createFileshare, uploadFile } from "../services/api";
import { bytesToLargestUnit } from "../utils/utils";

interface FileUploaderProps {
    onSizeChange: (size: number) => void
}

export const FileUploader = ({ onSizeChange }: FileUploaderProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [code, setCode] = useState<number>(0);
    const [status, setStatus] = useState("Ready")

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);

        const updatedFiles = [...files, ...newFiles]

        e.target.value = "";

        setFiles(updatedFiles);
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)

        setFiles(newFiles);
    };

    useEffect(() => {
        onSizeChange(files.reduce((total, file) => {
            return total + file.size
        }, 0))
    }, [files])

    const uploadFiles = async () => {
        setStatus("Processing")
        const done = await Promise.all([createTarball(files), createFileshare()])
        const data = done[0]
        const fileshare_info = done[1]
        
        console.log(bytesToLargestUnit(data.length))
        setStatus("Uploading")

        uploadFile(fileshare_info.url, data).then(() => setStatus("Ready"))
        setFiles([])
        setCode(fileshare_info.code)
    }

    return (
        <div>
        <p>{status}</p>
        {code != 0 && <p>Uploaded to ID: {code}</p>}

        <input
        type="file"
        multiple
        onChange={handleFileChange}
        />

        <FileDisplay files={files} button={
            (index) => {
                return <button
                type="button"
                onClick={() => removeFile(index)}
                style={{
                    border: "none",
                    background: "transparent",
                    color: "#d32f2f",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "0.85rem",
                }}
                >
                Delete
                </button>
            }
        }
        />
        <button onClick={() => uploadFiles()}>Done</button>
        </div>
    );
}
