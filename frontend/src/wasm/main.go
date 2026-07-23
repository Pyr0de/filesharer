//go:build js && wasm

package main

import (
	"syscall/js"
)

type File struct {
	Name string
	Body []byte
}

func main() {
	js.Global().Set("createTarball", js.FuncOf(createTarballHelper))
	js.Global().Set("startOpenTarball", js.FuncOf(startOpenTarball))
	js.Global().Set("feedOpenTarball", js.FuncOf(feedOpenTarball))
	js.Global().Set("closeOpenTarball", js.FuncOf(closeOpenTarball))
	select {}
}
