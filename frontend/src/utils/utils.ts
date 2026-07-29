export function bytesToLargestUnit(bytes: number): string {
    const order = ["B", "KB", "MB", "GB"];

    let value = bytes;
    let unit = 0;

    while (value > 512 && unit < order.length) {
        value /= 1024;
        unit += 1;
    }

    return `${value.toFixed(2)}${order[unit]}`;
}
