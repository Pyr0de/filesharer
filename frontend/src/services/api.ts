import type { User } from "./user";

export interface APIError {
    code: string;
    message: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/Prod/`;

export async function createFileshare(): Promise<{
    code: number;
    url: string;
}> {
    const req = await fetch(`${API_URL}/create`, {
        method: "POST",
    });
    const json = await req.json();

    return json;
}

export async function uploadFile(url: string, file: Uint8Array): Promise<boolean> {
    const req = await fetch(url, {
        headers: {
            "Content-Type": "application/octet-stream",
        },
        method: "PUT",
        body: file as BodyInit,
    });

    return req.ok;
}

export async function getFile(code: number): Promise<Response> {
    const req = await fetch(`${API_URL}/get/${code}`);

    if (!req.ok) {
        throw new Error(`Error: ${req.status}\n${req.text}`);
    }

    const url = await req.text();

    const s3_req = await fetch(url);
    if (!s3_req.ok) {
        throw new Error(`Error: ${req.status}\n${req.text}`);
    }

    return s3_req;
}

export async function signupAPI(username: string, password: string): Promise<User | APIError> {
    const creds = {
        username: username,
        password: password,
    };

    const req = await fetch(`${API_URL}/signup`, {
        method: "POST",
        body: JSON.stringify(creds),
    });

    const json = await req.json();
    if (!req.ok) {
        return json as APIError;
    }
    return json;
}

export async function loginAPI(username: string, password: string): Promise<User | APIError> {
    const creds = {
        username: username,
        password: password,
    };

    const req = await fetch(`${API_URL}/login`, {
        method: "POST",
        body: JSON.stringify(creds),
    });

    const json = await req.json();
    if (!req.ok) {
        return json as APIError;
    }
    return json;
}
