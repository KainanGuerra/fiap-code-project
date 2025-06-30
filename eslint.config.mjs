import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import checkFile from 'eslint-plugin-check-file';
import importHelpers from 'eslint-plugin-import-helpers';
import jestEslint from 'eslint-plugin-jest';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/eslint.config.mjs',
      '**/commitlint.config.js',
      'scripts/**/*',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'import-helpers': importHelpers,
      jest: jestEslint,
      'check-file': checkFile,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: './',
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/unbound-method': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',

      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'import/prefer-default-export': 'off',
      'no-shadow': 'off',
      'no-console': ['error', { allow: ['debug', 'table'] }],
      'no-useless-constructor': 'off',
      'no-empty-function': 'off',
      'no-param-reassign': 'off',
      'lines-between-class-members': 'warn',
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',

          groups: [
            'module',
            [
              '/^@Modules/',
              '/^@Common/',
              '/^@Config/',
              '/^@Utils/',
              '/^@Shared/',
              '/^@Specs/',
              '/^@App/',
            ],
            ['parent', 'sibling', 'index'],
          ],

          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/!(@)': 'KEBAB_CASE',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
