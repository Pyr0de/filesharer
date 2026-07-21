import { useState } from "react"

interface SearchProp {
    setCode: (code: number) => void
}

export const Search = ({ setCode }: SearchProp) => {
    const [codeText, setCodeText] = useState("")

    const onClick = () => {
        if (!/^\d{6}$/.test(codeText)) {
            console.log("invalid code")
            return
        }
        setCode(+codeText)
    }

    return (
        <>

        <input
        type="search"
        onChange={(e) => {
            setCodeText(e.target.value)
        }}
        />
        <button onClick={onClick}>Download</button>

        </>
    )
}
