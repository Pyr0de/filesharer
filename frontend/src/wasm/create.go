//go:build js && wasm
package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"log"
	"syscall/js"
)

func ObjectToFile(file js.Value, callback func(File)) {
	then := js.FuncOf(func(this js.Value, args []js.Value) any {
		uint8Array := args[0]

		buf := make([]byte, uint8Array.Get("length").Int())
		js.CopyBytesToGo(buf, uint8Array)

		callback(File{
			Name: file.Get("name").String(),
			Size: int64(file.Get("size").Int()),
			Body: buf,
		})
		return nil
	})

	catch := js.FuncOf(func(this js.Value, args []js.Value) any {
		log.Fatal(args[0])
		return nil
	})

	file.Call("bytes").Call("then", then).Call("catch", catch)

}

func addFileToTarball(t *tar.Writer, file File) {
	hdr := &tar.Header{
		Name: file.Name,
		Mode: 0600,
		Size: int64(len(file.Body)),
	}
	if err := t.WriteHeader(hdr); err != nil {
		log.Fatal("Error: Write Header ", file, err)
	}
	if _, err := t.Write(file.Body); err != nil {
		log.Fatal("Error: Write Body ", err)
	}
}

func createTarballHelper(this js.Value, args []js.Value) any {
	if len(args) != 1{
		log.Printf("Error: Expected 1 argument: [File], found %d arguemnts", len(args))
		return nil
	}
	files_js := args[0]

	handler := js.FuncOf(func(this js.Value, args []js.Value) any {
		resolve := args[0]

		var buf bytes.Buffer
		g := gzip.NewWriter(&buf)
		t := tar.NewWriter(g)
		closeTarFile := func() {
			if err := t.Close(); err != nil {
				log.Fatal(err)
			}
			if err := g.Close(); err != nil {
				log.Fatal(err)
			}
			bytes := buf.Bytes()
			uint8Array := js.Global().Get("Uint8Array").New(len(bytes))
			js.CopyBytesToJS(uint8Array, bytes)

			resolve.Invoke(uint8Array)
		}

		remaining_files := files_js.Length()
		addFileCallback := func(file File) {
			addFileToTarball(t, file)

			remaining_files -= 1
			if remaining_files <= 0 {
				closeTarFile()
			}
		}

		for i := 0; i < files_js.Length(); i++ {
			go func() {
				file_js := files_js.Index(i)

				ObjectToFile(file_js, addFileCallback)
			}()
		}

		return nil
	})

	promise := js.Global().Get("Promise")

	return promise.New(handler)

}

