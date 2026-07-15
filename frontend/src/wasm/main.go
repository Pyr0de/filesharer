//go:build js && wasm

package main

import (
	"archive/tar"
	"bytes"
	"syscall/js"
	"log"
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

func createTarball(files []File) []byte {
	var buf bytes.Buffer
	t := tar.NewWriter(&buf)

	for _, file := range files {
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
	return buf.Bytes()
}

func createTarballHelper(this js.Value, args []js.Value) any {
	if len(args) != 1{
		log.Printf("Error: Expected 1 argument: [File], found %d arguemnts", len(args))
		return nil
	}
	
	var files []File
	files_js := args[0]
	
	for i := 0; i < files_js.Length(); i++ {
		file_js := files_js.Index(i)

		files = append(files, ObjectToFile(file_js))
	}

	data := createTarball(files)

	uint8Array := js.Global().Get("Uint8Array").New(len(data))
	js.CopyBytesToJS(uint8Array, data)

	return uint8Array

}

func main() {
	js.Global().Set("createTarball", js.FuncOf(createTarballHelper))
	select {}
}
