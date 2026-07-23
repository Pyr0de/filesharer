//go:build js && wasm

package main

import (
	"archive/tar"
	"compress/gzip"
	"errors"
	"io"
	"syscall/js"
)

var pw *io.PipeWriter

func startOpenTarball(this js.Value, args []js.Value) any {
	var pr *io.PipeReader
	pr, pw = io.Pipe()

	go func() {
		g, err := gzip.NewReader(pr)
		if err != nil {
			//rej.Invoke(err.Error())
			return 
		}
		defer g.Close()

		t := tar.NewReader(g)

		files := js.Global().Get("Array").New()
		for {
			hdr, err := t.Next()
			if err == io.EOF {
				//res.Invoke(files)
				js.Global().Call("onFilesReady", files)
				pr.Close()
				return
			}
			if err != nil {
				//rej.Invoke(err.Error())
				return
			}

			if hdr.Typeflag != tar.TypeReg {
				continue
			}

			// Read this entry's full content.
			// tr.Read blocks internally on pr.Read until enough
			// bytes for this entry (or its 512-padding) are available.
			data := make([]byte, hdr.Size)
			if _, err := io.ReadFull(t, data); err != nil {
				js.Global().Call("onTarError", err.Error())
				return
			}

			files.Call("push", createFile(hdr.Name, data))
		}
	}()

	return nil

}

func feedOpenTarball(this js.Value, args []js.Value) any {
	uint8Array := args[0]

	body := make([]byte, uint8Array.Get("length").Int())
	
	js.CopyBytesToGo(body, uint8Array)
	go func() {
		pw.Write(body)
	}()

	return nil
}

func closeOpenTarball(this js.Value, args []js.Value) any {
	if len(args) > 0 {
		err := errors.New(args[0].String())
		pw.CloseWithError(err)
	}else {
		pw.Close()
	}
	return nil
}

func createFile(name string, body []byte) js.Value {
	uint8array := js.Global().Get("Uint8Array").New(len(body))
	js.CopyBytesToJS(uint8array, body)

	blobParts := js.Global().Get("Array").New(1)
	blobParts.SetIndex(0, uint8array)

	file := js.Global().Get("File").New(blobParts, name)

	return file
}
