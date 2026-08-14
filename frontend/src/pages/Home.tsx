import { useState } from "react";
import { bytesToLargestUnit } from "../utils/utils";
import { FileUploader } from "../components/FileUpload";
import { ProgressBar } from "../components/ProgressBar";

export const HomePage = () => {
    const [totalSize, setTotalSize] = useState(0);
    const maxSize = 10485760;

    return (
        <>
            <ProgressBar
                label="Size"
                barLabel={`${bytesToLargestUnit(totalSize)}`}
                rightLabel={`${bytesToLargestUnit(maxSize)}`}
                percentage={totalSize / 10485760}
            />
            <FileUploader 
            totalSize={totalSize}
            maxSize={maxSize}
            onSizeChange={setTotalSize}
            />
        </>
    );
};
