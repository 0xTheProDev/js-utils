// This configuration is applied from the workspace root.
module.exports = {
  "package.json": ["sort-package-json", "check-yarn-lock"],
  "yarn.lock": ["check-yarn-lock"],
  "*.{cjs,js,mjs,ts}": ["prettier --write", "eslint --fix"],
  "*.{json,md,yaml,yml}": ["prettier --write"],
};
