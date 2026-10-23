# @codeoscopic/tsdown-config

This package includes our [tsdown](https://tsdown.dev) config for React libraries. It replaces `@codeoscopic/tsup-config` and produces the same output.

## Installation and configuration

1. Install the package:

```sh
npm install -D tsdown @tsdown/css typescript@^7 @codeoscopic/tsdown-config
```

It requires Node.js ^22.18.0, ^24.11.0 or >=26.

2. Create a `tsdown.config.mts` file in your project root with:

```ts
import { defineConfig } from "tsdown";
import { defaultOptions } from "@codeoscopic/tsdown-config/dist/react.js";

export default defineConfig(defaultOptions);
```

The `.mts` extension marks the file as an ES module, so Node.js doesn't warn about it in packages without `"type": "module"`. In ES module packages, `tsdown.config.ts` works too.

3. Extend `@codeoscopic/tsconfig/tsdown.json` in your `tsconfig.json`. It types `*.css` and `*.module.css` imports, and turns off declaration maps so no source maps are published, as with tsup.

## What it builds

From `src/index.ts`:

| File                                  | Contents                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `dist/index.js`                       | CommonJS                                                                                                         |
| `dist/index.mjs`                      | ES module                                                                                                        |
| `dist/index.d.ts`, `dist/index.d.mts` | Type declarations                                                                                                |
| `dist/index.css`                      | All imported CSS, with `*.module.css` files as CSS modules (PostCSS with `postcss-modules` and `postcss-nested`) |

These are the same file names `@codeoscopic/tsup-config` produced, so `main`, `module` and `types` in your `package.json` don't change. Output is minified except in watch mode (`tsdown --watch`).

`dependencies` and `peerDependencies` are left out of the bundle by tsdown itself. JSX uses the automatic runtime, so React doesn't need to be imported.

## Migrating from @codeoscopic/tsup-config

- Replace `tsup` with `tsdown` and `@tsdown/css`, and `@codeoscopic/tsup-config` with `@codeoscopic/tsdown-config`.
- Rename `tsup.config.ts` to `tsdown.config.mts`, as above.
- Use TypeScript 7 directly. tsdown generates `.d.ts` files with TypeScript 7's compiler, so the TypeScript 6 aliases that tsup needed aren't required.
- React is no longer injected into every file. Import what you use from `"react"`.
