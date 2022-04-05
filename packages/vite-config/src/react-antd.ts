import type { Alias, ConfigEnv, UserConfig } from "vite";
import vitePluginImp from "vite-plugin-imp";
import { AntdResolver } from "vite-plugin-imp/dist/resolvers/antd";
import { createOptions as createReactOptions } from "./react";

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
} = {}) {
  return (env: ConfigEnv): UserConfig => {
    // Get default react vite options
    const options = createReactOptions(reactParams)(env);

    return {
      ...options,
      plugins: [
        ...(options.plugins || []),
        vitePluginImp({
          // Adds antd imports
          libList: [AntdResolver],
        }),
      ],
      css: {
        ...options.css,
        preprocessorOptions: {
          ...options.css?.preprocessorOptions,
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
        ...options.resolve,
        alias: [
          ...((options.resolve?.alias as readonly Alias[]) || []),
          // Allow node_module imports using ~ used for antd
          { find: /^~/, replacement: "" },
        ],
      },
    };
  };
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
