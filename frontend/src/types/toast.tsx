export type ToastTypes = "error" | "success" | "info"

export interface Toast {
    id: number,
    type: ToastTypes,
    message: string,
}

