# @codeoscopic/eslint-config

This package includes our eslint custom config for TypeScript and React projects.

## Installation and configuration

1. Install the package:

```sh
npm install -D eslint @codeoscopic/eslint-config
```

2. Create a `.eslintrc.js` file in your project root with:

```js
module.exports = {
  extends: ["@codeoscopic/eslint-config"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
```
