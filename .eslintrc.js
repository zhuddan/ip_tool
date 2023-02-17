module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['prettier', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2],
    'no-console': 'off',
    'linebreak-style': ['error', 'windows'],
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-unused-vars': 1,
  },
};
