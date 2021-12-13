require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@saberhq/eslint-config"],
  ignorePatterns: ["target/"],
  parserOptions: {
    project: "tsconfig.json",
  },
};
