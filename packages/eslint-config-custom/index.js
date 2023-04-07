module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:prettier/recommended',
    'prettier',
    'turbo',
  ],
  ignorePatterns: ['.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};
