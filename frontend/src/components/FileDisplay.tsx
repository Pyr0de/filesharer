import type { ReactNode } from "react";
import { bytesToLargestUnit } from "../utils/utils";

interface FileDisplayProps {
    files: File[];
    button: (index: number) => ReactNode;
}

export const FileDisplay = ({ files, button }: FileDisplayProps) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "12px",
                marginTop: "16px",
            }}
        >
            {files.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "12px",
                        backgroundColor: "#fafafa",
                        minHeight: "70px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                        title={file.name}
                    >
                        {file.name}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "8px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "0.85rem",
                                color: "#666",
                            }}
                        >
                            {bytesToLargestUnit(file.size)}
                        </span>
                        <div>{button(index)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
