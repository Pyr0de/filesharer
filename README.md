# FileSharer

[Website](https://pyr0de.github.io/filesharer/#/)

A website to allow short term storage and retrieval of files

## Tech Stack
### Frontend
- React
- Vite
- WASM (Go)

### Backend
- Go
- AWS Lambda


## Building

### Backend
```sh
cd backend

sam build
sam deploy --guided
```

### Frontend
```sh
cd frontend

# Build WASM Module
../src/wasm/build.sh
```

```sh
# Dev
npm run dev
# Build
npm run build
```

