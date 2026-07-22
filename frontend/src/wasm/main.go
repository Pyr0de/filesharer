//go:build js && wasm

package main

import (
	"syscall/js"
)

type File struct {
	Name string
	Size int64
	Body []byte
}

func main() {
	js.Global().Set("createTarball", js.FuncOf(createTarballHelper))
	select {}
}
