import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        ignores: ['node_modules/', '.next/', 'dist/', 'build/', 'out/'],
    },

    {
        files: ['socket/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['./socket/tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
                sourceType: 'module',
            },
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            ...prettierConfig.rules,

            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'prettier/prettier': 'error',
            'prefer-const': 'error',
            'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
            'no-undef': 'off',
        },
    },

    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@next/next': nextPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            // next/core-web-vitals 적용
            ...nextPlugin.configs['core-web-vitals'].rules,
            ...prettierConfig.rules,

            'react/react-in-jsx-scope': 'off',
            'prettier/prettier': 'error',
            'prefer-const': 'error',
            'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
        },
    },
];
