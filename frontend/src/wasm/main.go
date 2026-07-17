//go:build js && wasm

package main

import (
	"archive/tar"
	"bytes"
	"fmt"
	"log"
	"syscall/js"
)

type File struct {
	Name string
	Size int64
	Body []byte
}

func ObjectToFile(file js.Value) File {
	return File{
		Name: file.Get("name").String(),
		Size: int64(file.Get("size").Int()),
		Body: []byte("asd"),
	}
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
		t := tar.NewWriter(&buf)

		remaining_files := files_js.Length()
		for i := 0; i < files_js.Length(); i++ {
			go func() {
				file_js := files_js.Index(i)
				fmt.Println(i, file_js)
				file := ObjectToFile(file_js)

				addFileToTarball(t, file)

				remaining_files -= 1

				if remaining_files <= 0 {
					if err := t.Close(); err != nil {
						log.Fatal(err)
					}
					bytes := buf.Bytes()
					uint8Array := js.Global().Get("Uint8Array").New(len(bytes))
					js.CopyBytesToJS(uint8Array, bytes)

					resolve.Invoke(uint8Array)
				}
			}()
		}

		return nil
	})

	promise := js.Global().Get("Promise")

	return promise.New(handler)

}

func main() {
	js.Global().Set("createTarball", js.FuncOf(createTarballHelper))
	select {}
}
