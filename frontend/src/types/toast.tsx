export type ToastTypes = "error" | "success" | "info";

export interface ToastData {
    id: number;
    type: ToastTypes;
    message: string;
}
