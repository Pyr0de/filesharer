/// <reference lib="webworker" />
declare class Go {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
}
declare global {
    function createTarball(files: File[]): Promise<Uint8Array>
    function openTarball(data: Uint8Array): Promise<File[]>
}

importScripts("../../wasm/wasm_exec.js")

async function initWasm(): Promise<void> {
    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch("/wasm/app.wasm"),
        go.importObject
    )
    go.run(result.instance)
}

onmessage = async (event: MessageEvent<Uint8Array>) => {
    await initWasm()

    postMessage(await self.openTarball(event.data))
}

