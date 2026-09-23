import path from "path";
import fs from "fs";
import type { ConfigEnv, UserConfig } from "vite";
import { loadEnv } from "vite";
import type { SentryVitePluginOptions } from "@sentry/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
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
  readonly sentryOptions?: Partial<SentryVitePluginOptions>;
} = {}) {
  return (env: ConfigEnv): UserConfig => {
    const { VITE_RELEASE, VITE_ENVIRONMENT } = loadEnv(env.mode, process.cwd());
    const defaultConfigFile = path.resolve(process.cwd(), ".sentryclirc");
    const enableSentry =
      !!VITE_RELEASE && (fs.existsSync(defaultConfigFile) || !!sentryOptions);

    return {
      plugins: [
        // Setup sentry.
        //
        // NOTE: credentials now come from SENTRY_AUTH_TOKEN / SENTRY_ORG /
        // SENTRY_PROJECT (or from an explicit `sentryOptions`). `.sentryclirc`
        // is still honoured as the *enable* signal for backwards
        // compatibility, but the official plugin does not read credentials
        // from it the way `vite-plugin-sentry` did.
        enableSentry &&
          sentryVitePlugin(
            merge.withOptions({ mergeArrays: false }, sentryOptions || {}, {
              release: {
                name: VITE_RELEASE,
                setCommits: {
                  auto: true,
                },
                ...(VITE_ENVIRONMENT && {
                  deploy: {
                    env: VITE_ENVIRONMENT,
                  },
                }),
              },
              sourcemaps: {
                assets: [`./dist/${assetsDir}/**`],
                ignore: ["node_modules"],
              },
            }) as SentryVitePluginOptions,
          ),
      ],
      resolve: {
        // Set path alias from tsconfig paths. Native since Vite 7, replaces
        // the vite-tsconfig-paths plugin.
        tsconfigPaths: true,
      },
      build: {
        // Change assets default folder to static and use assets for dynamic files.
        assetsDir,
        // Generate asset manifest
        manifest: "asset-manifest.json",
        // Generate sourcemap when building with sentry enabled by default
        sourcemap: env.command === "build" && enableSentry,
        rollupOptions: {
          output: {
            // Change default assets to contain only hash
            entryFileNames: `${assetsDir}/[hash].js`,
            chunkFileNames: `${assetsDir}/[hash].js`,
            assetFileNames: `${assetsDir}/[hash].[ext]`,
          },
        },
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
