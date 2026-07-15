import { useEffect, useState } from 'react'
import './App.css'
import { FileUploader } from './components/FileUpload'
import { bytesToLargestUnit } from './utils/utils'
import { initWasm } from './utils/wasm'

function App() {
    const [totalSize, setTotalSize] = useState(0)

    useEffect(() => {
        initWasm()
    })

    return (
        <>
            <p>{bytesToLargestUnit(totalSize)}</p>
            <FileUploader onSizeChange={setTotalSize}/>
        </>
    )
}

export default App
