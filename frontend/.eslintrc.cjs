module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'react/jsx-no-bind': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/label-has-associated-control': [2, {
      controlComponents: ['Input'],
      depth: 3,
    }],
  },
};