module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "prettier",
    "turbo"
  ],
  ignorePatterns: ['.eslintrc.js'],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
}
