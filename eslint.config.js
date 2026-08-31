import js from "@eslint/js";
import ts from "typescript-eslint";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: [
      ".output/",
      ".vercel/",
      "dist/",
      "node_modules/",
      ".agents/",
      "public/",
      "src/routeTree.gen.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
