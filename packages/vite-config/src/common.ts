import path from "path";
import fs from "fs";
import { ConfigEnv, loadEnv, UserConfig } from "vite";
import vitePluginHtmlEnv from "vite-plugin-html-env";
import viteSentry, { ViteSentryPluginOptions } from "vite-plugin-sentry";
import tsconfigPaths from "vite-tsconfig-paths";
import merge from "ts-deepmerge";

export function createOptions({
  sentryOptions,
  assetsDir = "static",
}: {
  /**
   * Directory relative from `outDir` where the built js/css/image assets will
   * be placed.
   * @default 'static'
   */
  readonly assetsDir?: string;
  /**
   * Sentry options
   */
  readonly sentryOptions?: Partial<ViteSentryPluginOptions>;
} = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (env: ConfigEnv): UserConfig => {
    const { VITE_RELEASE, VITE_ENVIRONMENT } = loadEnv(env.mode, process.cwd());
    const defaultConfigFile = path.resolve(process.cwd(), ".sentryclirc");
    const enableSentry =
      !!VITE_RELEASE && (fs.existsSync(defaultConfigFile) || !!sentryOptions);

    return {
      plugins: [
        // Setup sentry
        enableSentry &&
          viteSentry(
            merge.withOptions({ mergeArrays: false }, sentryOptions || {}, {
              release: VITE_RELEASE,
              configFile: defaultConfigFile,
              setCommits: {
                auto: true,
              },
              sourceMaps: {
                include: [`./dist/${assetsDir}`],
                ignore: ["node_modules"],
                urlPrefix: `~/${assetsDir}`,
              },
              ...(VITE_ENVIRONMENT && {
                deploy: {
                  env: VITE_ENVIRONMENT,
                },
              }),
            })
          ),
        // Enables HTML templating
        vitePluginHtmlEnv(),
        // Set path alias from tsconfig paths
        tsconfigPaths(),
      ],
      build: {
        // Change assets default folder to static and use assets for dynamic files.
        assetsDir: "static",
        // Generate asset manifest
        manifest: "asset-manifest.json",
        // Generate sourcemap when building with sentry enabled by default
        sourcemap: env.command === "build" && enableSentry,
      },
    };
  };
}

/**
 * Default options for build libraries.
 *
 * @example
 * import { defineConfig } from "vite";
 * import defaultOptions from "@codeoscopic/vite-config/dist/common";
 *
 * export default defineConfig(defaultOptions);
 */
export default createOptions();
