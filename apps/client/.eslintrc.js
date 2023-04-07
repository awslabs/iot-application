module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'custom',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // https://formatjs.io/docs/tooling/linter
  plugins: ['formatjs', '@tanstack/query', 'testing-library', 'jest-dom'],
  rules: {
    'formatjs/no-offset': 'error',
    '@typescript-eslint/no-throw-literal': 'off',
  },
  root: true,
};
