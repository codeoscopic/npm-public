import path from "path";
import fs from "fs";
import type { Options } from "tsup";

// Import package.json from the app directory
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
) as Record<string, Record<string, string>>;

const { dependencies = {}, peerDependencies = {} } = packageJson;

/**
 * Default options for build libraries using React.
 *
 * @example
 * import { defineConfig } from "tsup";
 * import { defaultOptions } from "@codeoscopic/tsup-config/dist/react.js";
 *
 * export default defineConfig(defaultOptions);
 */
export function defaultOptions(options: Options): Options {
  return {
    // Default entry point
    entry: ["src/index.ts"],
    // Generate ESM and CommonJS modules
    format: ["esm", "cjs"],
    // Generate a .d.ts files
    dts: true,
    // Use dependencies as external (Don't include libraries in bundle)
    external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
    // Don't minify if in watch mode (possible dev build)
    minify: !options.watch,
    // Inject React imports into the bundle to avoid importing it in each file
    inject: [path.resolve(__dirname, "react-import.js")],
  };
}
