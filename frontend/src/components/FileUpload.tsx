import { type ChangeEvent, useState, useEffect, useRef } from "react";
import { FileDisplay } from "./FileDisplay";
import { createFileshare, uploadFile } from "../services/api";
import { bytesToLargestUnit } from "../utils/utils";
import { useToast } from "../context/toast";
import { Link } from "react-router-dom";
import { Button } from "./Button";

interface FileUploaderProps {
    totalSize: number;
    maxSize: number;
    onSizeChange: (size: number) => void;
}

export const FileUploader = ({ totalSize, maxSize, onSizeChange }: FileUploaderProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [code, setCode] = useState("");
    const [allowUpload, setAllowUpload] = useState(true);
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
        if (totalSize >= maxSize) {
            showToast(
                `Total size of files is more than ${bytesToLargestUnit(maxSize)}`,
                "error",
                3000,
            );
            return;
        }
        setAllowUpload(false);
        const tarballPromise: Promise<Uint8Array> = new Promise((res, rej) => {
            const worker = new Worker(new URL("../services/tarballWorker.ts", import.meta.url));

            worker.onmessage = (event: MessageEvent<Uint8Array>) => {
                res(event.data);
            };
            worker.onerror = (e) => {
                rej(e);
            };
            worker.postMessage({ type: "init", data: import.meta.env.BASE_URL });
            worker.postMessage({ type: "create", data: files });
        });
        showToast("Processing", "info", 3000);
        const data = await tarballPromise;

        const fileshare_info = await createFileshare(data.length);

        showToast(`Uploading`, "info", 3000);

        uploadFile(fileshare_info.url, data).then(() => {
            setAllowUpload(true);
            showToast(`Uploaded ${bytesToLargestUnit(data.length)}`, "success", 3000);
        });
        setFiles([]);
        setCode(`${fileshare_info.code}`);
    };

    const inputTag = useRef<HTMLInputElement>(null);

    return (
        <div className="font-body bg-void text-text rounded-xl px-8 py-4">
            {code != "" && (
                <div className="border-accent-dim mb-4 rounded-lg border px-3.5 py-2.5 text-xs">
                    Uploaded with code:{" "}
                    <Link
                        to={{
                            pathname: "download",
                            search: `?code=${code}`,
                        }}
                        className="text-link font-mono"
                    >
                        {code}
                    </Link>
                </div>
            )}
            <input
                ref={inputTag}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="bg-surface border-border rounded-lg border px-4 py-5">
                <FileDisplay
                    files={files}
                    button={(index) => {
                        return (
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-danger font-body cursor-pointer border-0 p-0"
                            >
                                Delete
                            </button>
                        );
                    }}
                    addFileButton={
                        <button
                            className="border-border bg-surface text-highlight flex min-h-[70px] cursor-pointer flex-col justify-between rounded-lg border p-3 hover:opacity-90"
                            onClick={() => inputTag.current?.click()}
                        >
                            <p className="flex h-full items-center justify-center">Add files</p>
                        </button>
                    }
                />
            </div>

            <Button
                className={`mt-4 ${!allowUpload ? "bg-muted" : ""}`}
                onClick={() => uploadFiles()}
                disabled={!allowUpload}
            >
                Done
            </Button>
        </div>
    );
};
