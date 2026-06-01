import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,

  // Frontend Configuration (Universal JavaScript and JSX)
  {
    files: ["**/*.js", "index.js", "**/*.jsx"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          // Changed to standard React/JSX presets so you don't need 'babel-preset-expo'
          presets: ["@babel/preset-react"], 
        },
        ecmaFeatures: {
          jsx: true, 
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Modern React/React Native does not require importing 'React' manually
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },

  // Backend Configuration (TypeScript)
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ["**/*.ts"],
  })),
];
