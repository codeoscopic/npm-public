import type { ConfigEnv, UserConfig } from "vite";
import react, { Options } from "@vitejs/plugin-react";
import commonOptions from "./common";

/**
 * Default options for build libraries.
 *
 * @example
 * import { defineConfig } from "vite";
 * import defaultOptions from "@codeoscopic/vite-config/dist/react";
 *
 * export default defineConfig(defaultOptions);
 */
export default function defaultOptions(
  env: ConfigEnv,
  reactPluginOps?: Options
): UserConfig {
  // Get default common vite options
  const options = commonOptions(env);

  return {
    ...options,
    plugins: [
      ...(options.plugins || []),
      // Include react plugin
      react(reactPluginOps),
    ],
  };
}
