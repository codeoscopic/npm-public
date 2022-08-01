import type { ConfigEnv, UserConfig } from "vite";
import vitePluginImp from "vite-plugin-imp";
import { createOptions as createReactOptions } from "./react";
import { compose } from "./utils";

/**
 * Create custom options with default options.
 *
 * @example
 * import { defineConfig } from "vite";
 * import { createOptions } from "@codeoscopic/vite-config/dist/react-antd";
 *
 * export default defineConfig(createOptions({ ... }));
 */
export function createOptions({
  variablesSrc,
  ...reactParams
}: Parameters<typeof createReactOptions>[0] & {
  /**
   * Define the path to the variables file to override antd variables.
   */
  readonly variablesSrc?: string;
} = {}): (env: ConfigEnv) => UserConfig {
  return compose(
    // Get default react vite options
    createReactOptions(reactParams),
    // Add react-antd options
    {
      plugins: [
        vitePluginImp({
          // Adds antd imports
          libList: [
            {
              libName: "antd",
              style(name): string {
                return `antd/es/${name}/style/css.js`;
              },
            },
          ],
        }),
      ],
      css: {
        preprocessorOptions: {
          less: {
            ...(variablesSrc && {
              modifyVars: {
                hack: `true; @import "${variablesSrc}";`,
              },
            }),
            // Enable javascript in less used for antd
            javascriptEnabled: true,
          },
        },
      },
      resolve: {
        alias: [
          // Allow node_module imports using ~ used for antd
          { find: /^~/, replacement: "" },
        ],
      },
    }
  );
}

/**
 * Default options for build libraries.
 *
 * @example
 * import { defineConfig } from "vite";
 * import defaultOptions from "@codeoscopic/vite-config/dist/react-antd";
 *
 * export default defineConfig(defaultOptions);
 */
export default createOptions();
