import path from "path";
import fs from "fs";
import { ConfigEnv, loadEnv, UserConfig } from "vite";
import vitePluginHtmlEnv from "vite-plugin-html-env";
import viteSentry, { ViteSentryPluginOptions } from "vite-plugin-sentry";
import tsconfigPaths from "vite-tsconfig-paths";

export function createOptions({
  sentryOptions,
}: {
  /**
   * Sentry options
   */
  readonly sentryOptions?: Partial<ViteSentryPluginOptions>;
} = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (env: ConfigEnv): UserConfig => {
    const { VITE_RELEASE, VITE_ENVIRONMENT } = loadEnv(env.mode, process.cwd());
    const defaultConfigFile = path.resolve(process.cwd(), ".sentryclirc");
    const enableSentry = fs.existsSync(defaultConfigFile) || !!sentryOptions;

    return {
      plugins: [
        // Setup sentry
        ...(enableSentry
          ? [
              viteSentry({
                release: VITE_RELEASE,
                configFile: defaultConfigFile,
                setCommits: {
                  auto: true,
                  ...sentryOptions?.setCommits,
                },
                sourceMaps: {
                  include: ["./dist/assets"],
                  ignore: ["node_modules"],
                  urlPrefix: "~/assets",
                  ...sentryOptions?.sourceMaps,
                },
                ...(VITE_ENVIRONMENT && {
                  deploy: {
                    env: VITE_ENVIRONMENT,
                  },
                }),
                ...sentryOptions,
              }),
            ]
          : []),
        // Enables HTML templating
        vitePluginHtmlEnv(),
        // Set path alias from tsconfig paths
        tsconfigPaths(),
      ],
      build: {
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
