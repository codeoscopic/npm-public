// Makes `typescript` resolve to TypeScript 6 inside the ESLint process, so
// clients only need TypeScript 7.
//
// typescript-eslint (and the plugins built on it) needs TypeScript's JS API,
// which TypeScript 7.0 doesn't have. This package depends on TypeScript 6 under
// the name `typescript`; since clients install TypeScript 7 under that name,
// npm nests our copy in this package's own node_modules, where neither its
// `tsc` nor its `tsserver` shadow the client's.
//
// TODO: Remove this file and the `typescript` dependency once typescript-eslint
// supports TypeScript 7.1 (due around 24 November 2026):
// https://github.com/typescript-eslint/typescript-eslint/issues/10940
// https://github.com/typescript-eslint/typescript-eslint/pull/12803
import module from "node:module";
import { pathToFileURL } from "node:url";

if (typeof module.registerHooks !== "function") {
  throw new Error(
    "@codeoscopic/eslint-config needs Node.js ^22.15.0 or >=23.5.0 (module.registerHooks)."
  );
}

const require = module.createRequire(import.meta.url);
const { version } = require("typescript/package.json");
if (!version.startsWith("6.")) {
  throw new Error(
    `@codeoscopic/eslint-config needs TypeScript 6 for linting, but resolved ${version}.`
  );
}
const typescript6 = require.resolve("typescript");
const requireFromTypescript6 = module.createRequire(typescript6);

module.registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "typescript" || specifier.startsWith("typescript/")) {
      // Resolve `typescript/lib/...` subpaths inside the TypeScript 6 package.
      const file =
        specifier === "typescript"
          ? typescript6
          : requireFromTypescript6.resolve(
              `../${specifier.slice("typescript/".length)}`
            );
      // TypeScript 6 ships CommonJS files only.
      return { url: pathToFileURL(file).href, format: "commonjs", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
