import path from "path";
import fs, { promises as fsPromises } from "fs";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import postcssNested from "postcss-nested";
import type { Options } from "tsup";

// Import package.json from the app directory
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
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
    // Allow PostCSS modules
    esbuildPlugins: [
      {
        name: "css-module",
        setup(build): void {
          build.onResolve(
            { filter: /\.module\.css$/, namespace: "file" },
            (args) => ({
              path: `${args.path}#css-module`,
              namespace: "css-module",
              pluginData: {
                pathDir: path.join(args.resolveDir, args.path),
              },
            }),
          );
          build.onLoad(
            { filter: /#css-module$/, namespace: "css-module" },
            async (args) => {
              const { pluginData } = args as {
                pluginData: { pathDir: string };
              };

              const source = await fsPromises.readFile(
                pluginData.pathDir,
                "utf8",
              );

              let cssModule = {};
              const result = await postcss([
                postcssNested(),
                postcssModules({
                  getJSON(_, json) {
                    cssModule = json;
                  },
                }),
              ]).process(source, { from: pluginData.pathDir });

              return {
                pluginData: { css: result.css },
                contents: `import "${
                  pluginData.pathDir
                }"; export default ${JSON.stringify(cssModule)}`,
              };
            },
          );
          build.onResolve(
            { filter: /\.module\.css$/, namespace: "css-module" },
            (args) => ({
              path: path.join(args.resolveDir, args.path, "#css-module-data"),
              namespace: "css-module",
              pluginData: args.pluginData as { css: string },
            }),
          );
          build.onLoad(
            { filter: /#css-module-data$/, namespace: "css-module" },
            (args) => ({
              contents: (args.pluginData as { css: string }).css,
              loader: "css",
            }),
          );
        },
      },
    ],
  };
}
