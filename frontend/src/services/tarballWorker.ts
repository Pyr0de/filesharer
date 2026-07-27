/// <reference lib="webworker" />
declare class Go {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
}
declare global {
    function createTarball(files: File[]): Promise<Uint8Array>
    function openTarball(data: Uint8Array): Promise<File[]>
}

type DataMap = {
    create: File[];
    open: Uint8Array;
};

type Message<T extends keyof DataMap = keyof DataMap> = {
    type: T;
    data: DataMap[T];
};

importScripts("../../wasm/wasm_exec.js")

async function initWasm(): Promise<void> {
    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch("/wasm/app.wasm"),
        go.importObject
    )
    go.run(result.instance)
}

const init = initWasm()

onmessage = async (event: MessageEvent<Message>) => {
    await init

    if (event.data.type === "create")
        postMessage(await self.createTarball(event.data.data as File[]))
    else if (event.data.type === "open")
        postMessage(await self.openTarball(event.data.data as Uint8Array))

}

