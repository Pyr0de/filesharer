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
	js.Global().Set("openTarball", js.FuncOf(openTarball))
	js.Global().Set("createTarball", js.FuncOf(createTarballHelper))
	select {}
}
