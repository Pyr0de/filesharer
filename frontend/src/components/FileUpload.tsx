import { type ChangeEvent, useState } from "react";
import { FileDisplay } from "./FileDisplay";

interface FileUploaderProps {
    onSizeChange: (size: number) => void
}

export const FileUploader = ({ onSizeChange }: FileUploaderProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);

        const updatedFiles = [...files, ...newFiles]

        e.target.value = "";

        onSizeChange(updatedFiles.reduce((total, file) => {
            return total + file.size
        }, 0))
        setFiles(updatedFiles);
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)

        onSizeChange(newFiles.reduce((total, file) => {
            return total + file.size
        }, 0))
        setFiles(newFiles);
    };

    const uploadFiles = async () => {
        const data = createTarball(files)

        var fileName = "archive.tar";
        var blob = new Blob([data.buffer as ArrayBuffer], {type: "application/x-tar"});

        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    return (
        <div>
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
