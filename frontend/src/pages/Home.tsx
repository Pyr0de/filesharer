import { useState } from "react";
import { bytesToLargestUnit } from "../utils/utils";
import { FileUploader } from "../components/FileUpload";
import { ProgressBar } from "../components/ProgressBar";
import { useAuth } from "../context/auth";

export const HomePage = () => {
    const [totalSize, setTotalSize] = useState(0);
    const { user } = useAuth()

    const maxSize = (user ? 50 : 10) * 1048576;

    return (
        <>
            <ProgressBar
                label="Size"
                barLabel={`${bytesToLargestUnit(totalSize)}`}
                rightLabel={`${bytesToLargestUnit(maxSize)}`}
                percentage={totalSize / maxSize}
            />
            <FileUploader totalSize={totalSize} maxSize={maxSize} onSizeChange={setTotalSize} />
        </>
    );
};
