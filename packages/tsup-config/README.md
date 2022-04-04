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
