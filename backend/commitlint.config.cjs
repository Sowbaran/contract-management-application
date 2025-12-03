const typeEnum = [
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [2, "always", typeEnum],
  },
  plugins: [
    {
      rules: {
        "type-enum": ({ type, subject }) => {
          if (typeEnum?.includes(type) && /^\[SAFE-\d+\] /.test(subject)) {
            return [true];
          }
          return [
            false,
            !/^\[NNDPF-\d+\] /.test(subject)
              ? `Commit message should start with <type>: '[SAFE-<number>] '.`
              : !typeEnum?.includes(type) &&
                `Type should be 'feat',
              'fix',
              'style',
              'refactor',
              'test',`,
          ];
        },
      },
    },
  ],
};
