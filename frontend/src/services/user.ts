export interface User {
    userId: string;
    username: string;
    token: string;
}

const KEY = "filesharer-user";

export function getStorageUser(): User | null {
    const str = localStorage.getItem(KEY);
    if (!str) {
        return null;
    }
    return JSON.parse(str) as User;
}

export function setStorageUser(user: User | null) {
    const str = JSON.stringify(user);
    localStorage.setItem(KEY, str);
}
