import type { ConfigEnv, UserConfig } from "vite";
import merge from "ts-deepmerge";

export const compose =
  (...fnOrObjs: readonly (UserConfig | ((env: ConfigEnv) => UserConfig))[]) =>
  (env: ConfigEnv): UserConfig =>
    merge(
      ...fnOrObjs.map((fnOrObj) =>
        typeof fnOrObj === "function" ? fnOrObj(env) : fnOrObj,
      ),
    );
