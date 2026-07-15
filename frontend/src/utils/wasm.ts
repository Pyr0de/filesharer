declare class Go {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
}

export async function initWasm() {
    const go = new Go();

    WebAssembly.instantiateStreaming(
        fetch("/wasm/app.wasm"),
        go.importObject
    ).then((result) => go.run(result.instance))
}
