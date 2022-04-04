import { Options } from "@vitejs/plugin-react";
import type { Alias, ConfigEnv, UserConfig } from "vite";
import vitePluginImp from "vite-plugin-imp";
import reactOptions from "./react";

/**
 * Default options for build libraries.
 *
 * @example
 * import { defineConfig } from "vite";
 * import defaultOptions from "@codeoscopic/vite-config/dist/react-antd";
 *
 * export default defineConfig(defaultOptions);
 */
export default function defaultOptions(
  env: ConfigEnv,
  reactPluginOps?: Options
): UserConfig {
  // Get default react vite options
  const options = reactOptions(env, reactPluginOps);

  return {
    ...options,
    plugins: [
      ...(options.plugins || []),
      // Optimize antd imports
      vitePluginImp({
        optimize: true,
        libList: [
          {
            libName: "antd",
            libDirectory: "es",
            style: (name) => `antd/es/${name}/style`,
          },
        ],
      }),
    ],
    css: {
      ...options.css,
      preprocessorOptions: {
        ...options.css?.preprocessorOptions,
        less: {
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
}
