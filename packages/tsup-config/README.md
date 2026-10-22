# @codeoscopic/tsup-config

This package includes our tsup-config custom config for React projects.

## Installation and configuration

1. Install the package:

```sh
npm install -D tsup @codeoscopic/tsup-config
```

2. Create a `tsup.config.ts` file in your project root with:

```ts
import { defineConfig } from "tsup";
import { defaultOptions } from "@codeoscopic/tsup-config/dist/react.js";

export default defineConfig(defaultOptions);
```

## Upgrading to 3.0.0

Since 3.0.0 the package is published as ES modules. `tsup.config.ts` loads it the same way, whether your package is CommonJS or ES modules (tested with tsup 7.3 and 9.0 on Node.js 24). Import it with the `.js` extension, as above.

tsup generates `.d.ts` files with the TypeScript compiler API, which TypeScript 7 doesn't have. Keep `typescript` on version 6 or older in projects that build with tsup.
