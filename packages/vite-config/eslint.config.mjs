import codeoscopic from "@codeoscopic/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(codeoscopic, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    // Relative imports carry an explicit `.ts` extension so Node can load
    // these sources directly - that is what lets a consuming app point at
    // this checkout without a build step. `rewriteRelativeImportExtensions`
    // turns them into `.js` on emit, so the published output is unaffected.
    "import-x/extensions": ["error", "ignorePackages", { ts: "always" }],
  },
});
