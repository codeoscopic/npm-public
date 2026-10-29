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

- It requires tsup 9, which needs Node.js ^22.18.0, ^24.11.0 or >=26.
- It's published as ES modules. `tsup.config.ts` loads it the same way, whether your package is CommonJS or ES modules. Import it with the `.js` extension, as above.

## TypeScript 7

tsup generates `.d.ts` files with the TypeScript compiler API, which TypeScript 7.0 doesn't have. To use TypeScript 7 (and the `@codeoscopic/tsconfig` 3.0.0 presets), install it [side by side with TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0), as the TypeScript team recommends:

```json
"devDependencies": {
  "@typescript/native": "npm:typescript@^7.0.2",
  "typescript": "npm:@typescript/typescript6@^6.0.2",
  "tsup": "^9.0.0"
}
```

`tsc` then runs TypeScript 7, while tsup (and other tools that import `typescript`) get TypeScript 6.

Without the aliases, keep `typescript` on version 6 or older.
