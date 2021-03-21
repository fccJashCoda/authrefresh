module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'new-cap': 'warn',
    'newline-per-chained-call': 'warn',
  },
};
