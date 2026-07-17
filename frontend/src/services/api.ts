const API_URL = `${import.meta.env.VITE_API_URL}/Prod/`

export async function createFileshare(): Promise<{
    code: number,
    url: string
}> {
    const req = await fetch(`${API_URL}/create`, {
        method: "POST"
    })
    const json = await req.json()

    return json
}

export async function uploadFile(url: string, file: Uint8Array): Promise<boolean> {
    const req = await fetch(url, {
        headers: {
            "Content-Type": "application/octet-stream"
        },
        method: "PUT",
        body: file
    })

    return req.ok
}
