//go:build js && wasm

package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"io"
	"syscall/js"
)

func openTarball(this js.Value, args []js.Value) any {
	if len(args) != 1 {
		return nil
	}

	data := make([]byte, args[0].Get("length").Int())
	js.CopyBytesToGo(data, args[0])

	buf := bytes.NewBuffer(data)

	g, err := gzip.NewReader(buf)
	if err != nil {
		return err
	}

	t := tar.NewReader(g)
	files := js.Global().Get("Array").New()

	for {
		hdr, err := t.Next()
		if err == io.EOF {
			break // End of archive
		}
		if err != nil {
			return err
		}
		
		body, err := io.ReadAll(t)
		if err != nil {
			return err
		}

		uint8array := js.Global().Get("Uint8Array").New(len(body))
		js.CopyBytesToJS(uint8array, body)

		blobParts := js.Global().Get("Array").New(1)
		blobParts.SetIndex(0, uint8array)

		file := js.Global().Get("File").New(blobParts, hdr.Name)

		files.Call("push", file)
	}
	return files
}
