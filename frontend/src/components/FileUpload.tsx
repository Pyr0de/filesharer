import { type ChangeEvent, useState, useEffect } from "react";
import { FileDisplay } from "./FileDisplay";
import { createFileshare, uploadFile } from "../services/api";
import { bytesToLargestUnit } from "../utils/utils";
import { useToast } from "../context/toast";

interface FileUploaderProps {
    onSizeChange: (size: number) => void;
}

export const FileUploader = ({ onSizeChange }: FileUploaderProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [code, setCode] = useState("");
    const { showToast } = useToast();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);

        const updatedFiles = [...files, ...newFiles];

        e.target.value = "";

        setFiles(updatedFiles);
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);

        setFiles(newFiles);
    };

    useEffect(() => {
        onSizeChange(
            files.reduce((total, file) => {
                return total + file.size;
            }, 0),
        );
    }, [files]);

    const uploadFiles = async () => {
        if (files.length < 1) {
            showToast("No files selected", "error", 3000);
            return;
        }
        const tarballPromise: Promise<Uint8Array> = new Promise((res, rej) => {
            const worker = new Worker(new URL("../services/tarballWorker.ts", import.meta.url));
            worker.onmessage = (event: MessageEvent<Uint8Array>) => {
                res(event.data);
            };
            worker.onerror = (e) => {
                rej(e);
            };
            worker.postMessage({ type: "create", data: files });
        });
        showToast("Processing", "info", 3000);
        const done = await Promise.all([tarballPromise, createFileshare()]);

        const data = done[0];
        const fileshare_info = done[1];

        showToast(`Uploading`, "info", 3000);

        uploadFile(fileshare_info.url, data).then(() => {
            showToast(`Uploaded ${bytesToLargestUnit(data.length)}`, "success", 3000);
        });
        setFiles([]);
        setCode(`${fileshare_info.code}`);
    };

    return (
        <div>
            {code != "" && (
                <p>
                    Uploaded with code:
                    <a href={`${window.location}download?code=${code}`}>{code}</a>
                </p>
            )}

            <input type="file" multiple onChange={handleFileChange} />

            <FileDisplay
                files={files}
                button={(index) => {
                    return (
                        <button
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
                    );
                }}
            />
            <button onClick={() => uploadFiles()}>Done</button>
        </div>
    );
};
