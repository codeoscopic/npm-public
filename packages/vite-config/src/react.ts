import type { ConfigEnv, UserConfig } from "vite";
import react, { Options as ReactOptions } from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { createOptions as createCommonOptions } from "./common";
import { compose } from "./utils";

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
        react(reactOptions),
        // Allow importing svg files
        svgrPlugin(),
      ],
    }
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
