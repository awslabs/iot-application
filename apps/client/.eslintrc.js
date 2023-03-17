module.exports = {
  env: {
    browser: true,
  },
  extends: ['custom'],
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.md
    {
      files: ['*.spec.ts', '*.test.ts'],
      plugins: ['jest'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',
      },
    },
  ],
  // https://formatjs.io/docs/tooling/linter
  plugins: ['formatjs'],
  rules: {
    'formatjs/no-offset': 'error',
  },
  root: true,
};
