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

[antd](https://ant.design/) 5 and later need no build configuration: use the `react` preset.

## Upgrading to 3.0.0

Since 3.0.0 the package is published as ES modules instead of CommonJS. Import paths need the `.js` extension (`@codeoscopic/vite-config/dist/react.js`, not `.../dist/react`), and the package can't be loaded with `require()`.

The `react-antd` preset is removed. It only did antd 4 work (per-component CSS imports with `vite-plugin-imp`, and Less `modifyVars` for its theme), which antd 5 and later don't need. Use `@codeoscopic/vite-config/dist/react.js`, and theme antd with `ConfigProvider` tokens.
