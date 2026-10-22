import codeoscopic from "@codeoscopic/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(codeoscopic, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
