# @codeoscopic/eslint-config

This package includes our ESLint flat config for TypeScript and React projects. It requires ESLint 10.

## Installation and configuration

1. Install the package:

```sh
npm install -D eslint @codeoscopic/eslint-config
```

2. Create an `eslint.config.mjs` file in your project root with:

```js
import codeoscopic from "@codeoscopic/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(codeoscopic, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

Import aliases from your tsconfig `paths` (e.g. `@/*`) are resolved automatically.

## TypeScript version

Projects only install TypeScript 7 (`npm install -D typescript@^7`). It needs Node.js ^22.15.0 or >=23.5.0.

Type-aware rules run on [typescript-eslint](https://typescript-eslint.io), which needs TypeScript's JS API, and TypeScript 7.0 doesn't have one. So this package brings its own TypeScript 6, which npm installs inside this package because your project's `typescript` is 7. `typescript6.js` then makes every `typescript` import in the ESLint process load that copy. Your `tsc` and editor keep using TypeScript 7.

This is temporary. TypeScript 7.1 (due around 24 November 2026) ships a new API, and typescript-eslint is adding support for it ([typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940), [typescript-eslint#12803](https://github.com/typescript-eslint/typescript-eslint/pull/12803)). Once that's released, remove `typescript6.js` and the `typescript` dependency and publish a new version; projects won't need to change anything.

## React rules

React rules come from [`@eslint-react/eslint-plugin`](https://eslint-react.xyz) instead of `eslint-plugin-react`, which doesn't support ESLint 10 ([jsx-eslint/eslint-plugin-react#3977](https://github.com/jsx-eslint/eslint-plugin-react/issues/3977)). The ESLint TSC [recommends it as the replacement](https://github.com/eslint/tsc-meetings/blob/main/notes/2026/2026-09-03.md), and it has been [invited to join the `eslint-community` organization](https://github.com/Rel1cx/eslint-react/issues/1950). It also includes the Rules of Hooks, so `eslint-plugin-react-hooks` isn't used; disable comments use `@eslint-react/exhaustive-deps`.

Our previous JSX conventions are kept where possible:

| Previous rule | Now |
| --- | --- |
| `react/jsx-props-no-spreading` (HTML elements) | `no-restricted-syntax` |
| `react/jsx-no-bind` (`.bind()` only) | `no-restricted-syntax` |
| `react/jsx-curly-brace-presence`, `react/jsx-pascal-case`, `react/self-closing-comp` | `@stylistic/jsx-*` |
| `react/jsx-handler-names`, `react/function-component-definition` | Dropped, no equivalent |

`eslint-plugin-jsx-a11y` doesn't declare ESLint 10 support either ([jsx-eslint/eslint-plugin-jsx-a11y#1075](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075)), but it doesn't use any API removed in ESLint 10, so it's kept. Install with `legacy-peer-deps=true` or an npm `overrides` entry for its `eslint` peer.
