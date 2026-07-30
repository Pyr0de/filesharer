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
                current={`${bytesToLargestUnit(totalSize)}`}
                total={`${bytesToLargestUnit(maxSize)}`}
                percentage={totalSize / 10485760}
            />
            <FileUploader onSizeChange={setTotalSize} />
        </>
    );
};
