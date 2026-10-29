import postcssNested from "postcss-nested";
import type { InlineConfig, UserConfig } from "tsdown";

/**
 * Default options for build libraries using React.
 *
 * Dependencies and peer dependencies of the library are left out of the
 * bundle by tsdown itself, and JSX uses the automatic runtime, so React
 * doesn't need to be imported.
 *
 * @example
 * import { defineConfig } from "tsdown";
 * import { defaultOptions } from "@codeoscopic/tsdown-config/dist/react.js";
 *
 * export default defineConfig(defaultOptions);
 */
export function defaultOptions(options: InlineConfig = {}): UserConfig {
  // Don't minify if in watch mode (possible dev build)
  const minify = !options.watch;

  return {
    // Default entry point
    entry: ["src/index.ts"],
    // Generate ESM and CommonJS modules
    format: ["esm", "cjs"],
    // Generate .d.ts files
    dts: true,
    minify,
    // Keep tsup's file names: index.js (CJS) and index.mjs (ESM), with
    // index.d.ts and index.d.mts, so packages' main/module/types still apply.
    outExtensions: ({ format }) =>
      format === "cjs"
        ? { js: ".js", dts: ".d.ts" }
        : { js: ".mjs", dts: ".d.mts" },
    // Bundle the CSS (including *.module.css) into dist/index.css
    css: {
      transformer: "postcss",
      postcss: { plugins: [postcssNested()] },
      fileName: "index.css",
      minify,
    },
  };
}
