module.exports = {
  extends: ['custom'],
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
};
