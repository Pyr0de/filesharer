import { useState } from 'react'
import { bytesToLargestUnit } from '../utils/utils'
import { FileUploader } from '../components/FileUpload'

export const HomePage = () => {
    const [totalSize, setTotalSize] = useState(0)

    return (
        <>
            <p>{bytesToLargestUnit(totalSize)}</p>
            <FileUploader onSizeChange={setTotalSize}/>
        </>
    )
}

