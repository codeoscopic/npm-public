import path from "path";
import type { ConfigEnv, UserConfig } from "vite";
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
  return (env: ConfigEnv): UserConfig => ({
    plugins: [
      // Setup sentry
      ...(sentryOptions
        ? [
            viteSentry({
              release: process.env.VITE_RELEASE,
              configFile: path.resolve(process.cwd(), ".sentryclirc"),
              setCommits: {
                auto: true,
                ...sentryOptions.setCommits,
              },
              sourceMaps: {
                include: ["./dist/assets"],
                ignore: ["node_modules"],
                urlPrefix: "~/assets",
                ...sentryOptions.sourceMaps,
              },
              ...(process.env.VITE_ENVIRONMENT && {
                deploy: {
                  env: process.env.VITE_ENVIRONMENT,
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
  });
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
