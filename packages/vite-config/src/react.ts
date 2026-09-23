import type { ConfigEnv, UserConfig } from "vite";
import type { Options as ReactOptions } from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { createOptions as createCommonOptions } from "./common.ts";
import { compose } from "./utils.ts";

/**
 * Create custom options with default options.
 *
 * @example
 * import { defineConfig } from "vite";
 * import { createOptions } from "@codeoscopic/vite-config/dist/react";
 *
 * export default defineConfig(createOptions({ ... }));
 */
export function createOptions({
  reactOptions,
  ...commonParams
}: Parameters<typeof createCommonOptions>[0] & {
  /**
   * Options for react plugin.
   */
  readonly reactOptions?: ReactOptions;
} = {}): (env: ConfigEnv) => UserConfig {
  return compose(
    // Get default common vite options
    createCommonOptions(commonParams),
    // Add react options
    {
      plugins: [
        // Include react plugin
        react(reactOptions ?? {}),
        // Allow importing svg files
        svgrPlugin({
          // Treat every .svg as a component, and keep the `ReactComponent`
          // named export that vite-plugin-svgr v3 produced, so consumers do
          // not have to rewrite their imports with `?react`.
          include: "**/*.svg",
          svgrOptions: { exportType: "named", namedExport: "ReactComponent" },
        }),
      ],
    },
  );
}

/**
 * Default options for build libraries.
 *
 * @example
 * import { defineConfig } from "vite";
 * import defaultOptions from "@codeoscopic/vite-config/dist/react";
 *
 * export default defineConfig(defaultOptions);
 */
export default createOptions();
