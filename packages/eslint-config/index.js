// Must run before anything loads `typescript`. Static imports are resolved
// before any module runs, so the plugins are imported dynamically below.
import "./typescript6.js";

const [
  { default: js },
  { default: eslintReact },
  { default: stylistic },
  { default: prettier },
  { createTypeScriptImportResolver },
  { default: functional },
  { createNodeResolver, importX },
  { default: jsxA11y },
  { defineConfig },
  { default: tseslint },
] = await Promise.all([
  import("@eslint/js"),
  import("@eslint-react/eslint-plugin"),
  import("@stylistic/eslint-plugin"),
  import("eslint-config-prettier"),
  import("eslint-import-resolver-typescript"),
  import("eslint-plugin-functional"),
  import("eslint-plugin-import-x"),
  import("eslint-plugin-jsx-a11y"),
  import("eslint/config"),
  import("typescript-eslint"),
]);

const TS_FILES = ["**/*.{ts,tsx,mts,cts}"];

export default defineConfig(
  js.configs.recommended,
  importX.flatConfigs.recommended,
  {
    settings: {
      "import-x/resolver-next": [
        // Resolves tsconfig `paths` aliases (e.g. "@/*") on its own.
        createTypeScriptImportResolver(),
        createNodeResolver(),
      ],
    },
    rules: {
      // Force to order imports
      "import-x/order": [
        "error",
        {
          pathGroups: [
            {
              pattern: "@codeoscopic/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "never",
        },
      ],

      // Kept from the Airbnb config this package used to extend
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-mutable-exports": "error",
      "import-x/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.config.{js,cjs,mjs,ts,cts,mts}",
            "**/scripts/**",
            "**/*.{test,spec}.{ts,tsx}",
          ],
        },
      ],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-else-return": ["error", { allowElseIf: false }],
      "no-useless-rename": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-template": "error",

      // Disallow reassignment of function parameters on draft for immer-js
      "no-param-reassign": [
        "error",
        { props: true, ignorePropertyModificationsFor: ["draft"] },
      ],

      // Disallow the use of console
      "no-console": ["error", { allow: ["warn", "error"] }],

      // Restrict the use of certain imports
      "no-restricted-imports": [
        "error",
        {
          // Limit to 3 max path parent
          patterns: ["../../../../*"],
          paths: [
            // Disallow to import lodash entry point
            "lodash",
            // Disallow to import react entry point
            {
              name: "react",
              importNames: ["default"],
            },
          ],
        },
      ],

      // Allow to use export { default } from "./some-module"
      "no-restricted-exports": [
        "error",
        {
          restrictedNamedExports: [
            "then", // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
          ],
        },
      ],
    },
  },
  {
    files: TS_FILES,
    extends: [
      tseslint.configs.recommendedTypeChecked,
      importX.flatConfigs.typescript,
      eslintReact.configs["recommended-type-checked"],
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      "@stylistic": stylistic,
      functional,
    },
    languageOptions: {
      parserOptions: {
        // Consumers set `tsconfigRootDir: import.meta.dirname` in their own config.
        projectService: true,
      },
    },
    rules: {
      // Require explicit return types on functions and class methods
      "@typescript-eslint/explicit-function-return-type": "error",

      // Disallow usage of the any type
      "@typescript-eslint/no-explicit-any": "error",

      // Allow using promises without then or return
      "@typescript-eslint/no-floating-promises": "off",

      // Don't check void returns on promises that are handled by non-promises
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],

      // Enforce consistent usage of type imports
      "@typescript-eslint/consistent-type-imports": "error",

      // Change default error to warning for exhaustive-deps
      "@eslint-react/exhaustive-deps": "warn",

      // Prefer readonly types
      "functional/prefer-property-signatures": "error",
      "functional/prefer-readonly-type": [
        "error",
        {
          allowLocalMutation: true,
          allowMutableReturnType: false,
          checkImplicit: false,
          ignoreClass: false,
          ignoreInterface: false,
        },
      ],

      // JSX conventions kept from eslint-plugin-react, which has no ESLint 10 support
      "@stylistic/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "@stylistic/jsx-pascal-case": "error",
      "@stylistic/jsx-self-closing-comp": "error",
      "no-restricted-syntax": [
        "error",
        {
          // Was react/jsx-props-no-spreading with `html: "enforce"`
          selector: "JSXOpeningElement[name.name=/^[a-z]/] > JSXSpreadAttribute",
          message: "Don't spread props on HTML elements.",
        },
        {
          // Was react/jsx-no-bind with `allowBind: false`
          selector:
            "JSXAttribute CallExpression > MemberExpression.callee[property.name='bind']",
          message: "Don't use .bind() in JSX props.",
        },
      ],
    },
  },
  prettier,
);
