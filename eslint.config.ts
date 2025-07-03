// eslint.config.ts
import type { FlatConfig } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const config: FlatConfig.ConfigArray = [
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    rules: {
      ...prettier.rules,
    },
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'coverage',
      '.eslintcache',
      '**/*.log',
      'logs',
      'build/Release',
      '.idea',
      '__snapshots__',
    ],
  },
];

export default config;
