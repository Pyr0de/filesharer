import type { ReactNode } from "react";
import { bytesToLargestUnit } from "../utils/utils";

interface FileDisplayProps {
    files: File[];
    addFileButton: ReactNode | undefined;
    button: (index: number) => ReactNode;
}

export const FileDisplay = ({ files, addFileButton, button }: FileDisplayProps) => {
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {files.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    className="border-border bg-surface flex min-h-[70px] flex-col justify-between rounded-lg border p-3"
                >
                    <div className="overflow-hidden font-semibold" title={file.name}>
                        {file.name}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-[0.85rem] text-[#565f89]">
                            {bytesToLargestUnit(file.size)}
                        </span>
                        <div>{button(index)}</div>
                    </div>
                </div>
            ))}
            {addFileButton}
        </div>
    );
};
