import path from "path";
import type { ConfigEnv, UserConfig } from "vite";
import vitePluginHtmlEnv from "vite-plugin-html-env";

/**
 * Default options for build libraries.
 *
 * @example
 * import { defineConfig } from "vite";
 * import defaultOptions from "@codeoscopic/vite-config/dist/common";
 *
 * export default defineConfig(defaultOptions);
 */
export default function defaultOptions(env: ConfigEnv): UserConfig {
  return {
    // Enables HTML templating
    plugins: [vitePluginHtmlEnv()],
    resolve: {
      alias: [
        // Allow to import files from src app directory using @/
        {
          find: "@",
          replacement: path.resolve(process.cwd(), "./src"),
        },
      ],
    },
  };
}
