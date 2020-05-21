module.exports = {
  extends: '@sub-tv/eslint-config',
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
  ignorePatterns: ['dist/**/*'],
  overrides: [
    {
      files: ['src/__tests__/**/*'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
};
