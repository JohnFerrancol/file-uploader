import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
    ignorePatterns: ['views/**/*.ejs'], // ignore EJS files
    languageOptions: { globals: globals.node },
  },
]);
