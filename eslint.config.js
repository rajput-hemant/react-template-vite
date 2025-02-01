import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
// import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import ts from "typescript-eslint";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  // ...tailwind.configs["flat/recommended"],
  {
    plugins: {
      "@typescript-eslint": ts.plugin,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        project: ["tsconfig.json", "tsconfig.node.json", "tsconfig.app.json"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...prettier.rules,
      // ...tailwind.configs.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "prefer-const": "error",
      "prettier/prettier": ["warn", {}],
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],
      "react/self-closing-comp": ["warn", { component: true, html: true }],
      // "tailwindcss/no-custom-classname": "warn",
      // "tailwindcss/classnames-order": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
    settings: {
      tailwindcss: { callees: ["cn", "cva"] },
      react: { version: "detect" },
    },
    ignores: [
      "dist",
      "node_modules",
      ".cache",
      "public",
      "coverage",
      "eslint.config.js",
      "*.esm.js",
    ],
  }
);
