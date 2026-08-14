/// <reference lib="webworker" />
declare class Go {
    importObject: WebAssembly.Imports;
    run(instance: WebAssembly.Instance): Promise<void>;
}
declare global {
    function createTarball(files: File[]): Promise<Uint8Array>;
    function startOpenTarball(): Promise<File[]>;
    function feedOpenTarball(data: Uint8Array): null;
    function closeOpenTarball(message: string | null): null;

    function onFilesReady(files: File[]): null;
}

type DataMap = {
    init: string;
    create: File[];
    startOpen: null;
    feedOpen: Uint8Array;
    closeOpen: string | null;
};

type Message<T extends keyof DataMap = keyof DataMap> = {
    type: T;
    data: DataMap[T];
};

async function initWasm(base: string): Promise<void> {
    importScripts(`${base}/wasm/wasm_exec.js`);

    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch(`${base}/wasm/app.wasm`),
        go.importObject,
    );
    go.run(result.instance);
}

globalThis.onFilesReady = (files: File[]) => {
    postMessage(files);
    return null;
};

let init: Promise<void>;

onmessage = async (event: MessageEvent<Message>) => {
    if (event.data.type === "init") {
        init = initWasm(event.data.data as string);

        return;
    }

    if (init == null) {
        return;
    }

    await init;

    if (event.data.type === "create")
        postMessage(await self.createTarball(event.data.data as File[]));
    else if (event.data.type === "startOpen") self.startOpenTarball();
    else if (event.data.type === "feedOpen") self.feedOpenTarball(event.data.data as Uint8Array);
    else if (event.data.type === "closeOpen")
        self.closeOpenTarball(event.data.data as string | null);
};
