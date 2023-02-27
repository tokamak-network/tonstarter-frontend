module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended'
  ],
  overrides: [
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    // Rules regarding react props
    'react/prop-types': 'off',
    // make sure hooks are used correctly; called at the top level of the component etc.
    'react-hooks/rules-of-hooks': 'error',
    // Disable 'React' library to import
    'react/react-in-jsx-scope': 'off',
    // If prettier rules exceptions
    'prettier/prettier': ['warn'],
    // Warn if function return type is missing
    '@typescript-eslint/explicit-function-return-type': 'warn',
  }
}
