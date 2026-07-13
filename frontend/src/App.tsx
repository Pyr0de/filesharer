import { useState } from 'react'
import './App.css'
import { FileUploader } from './components/FileUpload'

function App() {
    const [totalSize, setTotalSize] = useState(0)

    return (
        <>
            <p>{totalSize}</p>
            <FileUploader onSizeChange={setTotalSize}/>
        </>
    )
}

export default App
