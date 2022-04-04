# @codeoscopic/vite-config

This package includes our vite-config custom config for React projects.

## Installation and configuration

1. Install the package:

```sh
npm install -D vite @vitejs/plugin-react @codeoscopic/vite-config
```

2. Create a `vite.config.ts` file in your project root with:

```ts
import { defineConfig } from "vite";
import defaultOptions from "@codeoscopic/vite-config/dist/react";

export default defineConfig(defaultOptions);
```

If you want to use [antd](https://ant.design/) in your project, change the import for `@codeoscopic/vite-config/dist/react-antd` and install the following dependencies:

```sh
npm install antd
npm install -D less less-loader antd
```
