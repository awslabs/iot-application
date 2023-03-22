module.exports = {
  env: {
    node: true,
  },
  extends: ['custom'],
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
  root: true,
};
