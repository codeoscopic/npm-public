# @codeoscopic/vite-config

This package includes our vite-config custom config for React projects. It's published as ES modules.

## Installation and configuration

1. Install the package:

```sh
npm install -D vite @vitejs/plugin-react @codeoscopic/vite-config
```

2. Create a `vite.config.mts` file in your project root with:

```ts
import { defineConfig } from "vite";
import defaultOptions from "@codeoscopic/vite-config/dist/react.js";

export default defineConfig(defaultOptions);
```

To customize the options, use `createOptions` instead:

```ts
import { defineConfig } from "vite";
import { createOptions } from "@codeoscopic/vite-config/dist/react.js";

export default defineConfig(createOptions({ ... }));
```

If you want to use [antd](https://ant.design/) in your project, change the import for `@codeoscopic/vite-config/dist/react-antd.js` and install the following dependencies:

```sh
npm install antd
npm install -D less less-loader antd
```

## Upgrading to 3.0.0

Since 3.0.0 the package is published as ES modules instead of CommonJS. Import paths need the `.js` extension (`@codeoscopic/vite-config/dist/react.js`, not `.../dist/react`), and the package can't be loaded with `require()`.
