module.exports = {
  extends: ["custom-server"],
  parserOptions: {
    ecmaVersion: 2020,
    project: "tsconfig.json",
    sourceType: "module",
    ecmaFeatures: {
      jsx: false,
    },
  },
  root: true,
};
