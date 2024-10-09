import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

export default [
  { ignores: ['dist', '.eslintrc.js'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prefer-arrow-functions': preferArrowFunctions,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'prefer-template': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/button-has-type': 'error',
      'react/jsx-no-target-blank': 'off',
      'react/jsx-curly-brace-presence': 'error',
      'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-no-undef': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-pascal-case': 'error',
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-adjacent-inline-elements': 'error',
      'react/no-array-index-key': 'off',
      'react/no-danger': 'off',
      'react/no-typos': 'error',
      'react/no-unescaped-entities': 'off',
      'react/no-unstable-nested-components': 'error',
      'react/prefer-exact-props': 'error',
      'react/prop-types': ['error', { ignore: ['className'] }],
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.js', '.tsx'] },
      ],
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-indent-props': ['warn', 2],

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      semi: ['error', 'never'],
      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'implicit',
        },
      ],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      ],
      //'multiline-ternary': ['error', 'always-multiline'],
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
]
