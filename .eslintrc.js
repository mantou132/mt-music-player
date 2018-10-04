module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  env: {
    // http://eslint.org/docs/user-guide/configuring.html#specifying-environments
    browser: true, // browser global variables
    es6: true,
    worker: true,
    serviceworker: true
  },
  extends: [/* 'eslint:recommended',*/ 'airbnb-base'],
  // https://eslint.org/docs/rules/
  rules: {
    'import/extensions': 0,
    'no-param-reassign': 0,
    'no-use-before-define': 1
  }
};
