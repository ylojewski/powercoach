// src/commitlint/config.ts
var config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-empty": [2, "never"]
  }
};

export { config };
