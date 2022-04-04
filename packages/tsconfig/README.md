# @codeoscopic/tsconfig

This package includes our tsconfig custom config for TypeScript and React projects.

## Installation and configuration

1. Install the package:

```sh
npm install -D @codeoscopic/tsconfig
```

2. Create a `tsconfig.json` file in your project root (Choose appropriate json configuration)

- @codeoscopic/tsconfig/library.json _(For building TS libraries)_
- @codeoscopic/tsconfig/react-library.json _(For building React libraries)_
- @codeoscopic/tsconfig/vite.json _(For Vite React libraries)_

Example using vite configuration:

```json
{
  "extends": "@codeoscopic/tsconfig/vite.json",
  "include": ["src"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  }
}
```
