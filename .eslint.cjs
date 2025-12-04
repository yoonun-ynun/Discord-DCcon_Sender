module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2022: true,
    },
    ignorePatterns: ['node_modules/', '.next/', 'dist/', 'build/', 'out/'],

    plugins: ['prettier'],

    overrides: [
        {
            files: ['socket/**/*.{ts,tsx}'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: [__dirname + '/socket/tsconfig.json'],
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
            plugins: ['@typescript-eslint'],
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:prettier/recommended',
            ],
            rules: {
                '@typescript-eslint/no-unused-vars': 'warn',
                'prettier/prettier': 'error',
            },
        },

        {
            files: ['src/**/*.{js,jsx,ts,tsx}'],
            extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
            parserOptions: {
                sourceType: 'module',
            },
            rules: {
                'react/react-in-jsx-scope': 'off',
                'prettier/prettier': 'error',
                // 배포에서 console.log 막고 싶으면 나중에 이거 켜기
                // 'no-console': ['warn', { allow: ['warn', 'error'] }],
            },
        },
    ],
};
