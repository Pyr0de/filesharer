mkdir public/wasm -p

GOOS=js GOARCH=wasm go build -C src/wasm -o app.wasm
mv src/wasm/app.wasm public/wasm/app.wasm

if [ ! -f public/wasm/wasm_exec.js ]; then
  cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" public/wasm/
fi
