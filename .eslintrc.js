module.exports = {
  env: {
    node: true,
  },
  extends: ['custom', 'plugin:playwright/playwright-test'],
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
  root: true,
};
