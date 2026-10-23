declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Side-effect CSS imports (`import "./styles.css"`), which TypeScript 6+
// rejects without a declaration (`noUncheckedSideEffectImports`).
declare module "*.css";
