module.exports = {
  root: true,
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: ["functional"],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // Don't prefer default export when there is only a single export from a module
        "import/prefer-default-export": ["off"],

        // Require explicit return types on functions and class methods
        "@typescript-eslint/explicit-function-return-type": "error",

        // Disallow usage of the any type
        "@typescript-eslint/no-explicit-any": "error",

        // Disallow reassignment of function parameters on draft for immer-js
        "no-param-reassign": [
          "error",
          { props: true, ignorePropertyModificationsFor: ["draft"] },
        ],

        // Disallow the use of console
        "no-console": ["error", { allow: ["warn", "error"] }],

        // Using typescript we don't need to check missing props validation using prop-types
        "react/prop-types": "off",

        // Change default error to warning for exhaustive-deps
        "react-hooks/exhaustive-deps": "warn",

        // Allow using promises without then or return
        "@typescript-eslint/no-floating-promises": "off",

        // Prefer readonly types
        "functional/no-method-signature": "error",
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

        // Force to use conventional handle names
        "react/jsx-handler-names": [
          "error",
          {
            eventHandlerPrefix: "(handle|on|set)",
            eventHandlerPropPrefix: "on",
            checkLocalVariables: true,
            checkInlineFunction: false,
          },
        ],

        // Disallow JSX props spreading on html
        "react/jsx-props-no-spreading": [
          "error",
          {
            html: "enforce",
            custom: "ignore",
          },
        ],

        // Force to order imports
        "import/order": [
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

        // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#how-to-upgrade-to-the-new-jsx-transform
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",

        // Allow to use functions expressions and arrow functions on jsx
        "react/jsx-no-bind": [
          2,
          {
            allowArrowFunctions: true,
            allowFunctions: true,
            allowBind: false,
          },
        ],

        // Prefer arrow functions over function expressions when create a React component
        "react/function-component-definition": [
          "error",
          {
            namedComponents: "arrow-function",
            unnamedComponents: "function-expression",
          },
        ],

        // Allow to use export { default } from "./some-module"
        // https://github.com/airbnb/javascript/blob/366bfa66380c08304101c6add46355696e90b348/packages/eslint-config-airbnb-base/rules/es6.js#L65
        "no-restricted-exports": [
          "error",
          {
            restrictedNamedExports: [
              // "default", // use `export default` to provide a default export
              "then", // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
            ],
          },
        ],

        // Allow to use arrow functions to return React node in React components props
        "react/no-unstable-nested-components": [
          "error",
          { allowAsProps: true },
        ],

        // Don't check void returns on promises that are handled by non-promises
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            checksVoidReturn: false,
          },
        ],
      },
    },
  ],
};
