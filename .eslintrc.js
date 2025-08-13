module.exports = {
    root: true,
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react', '@typescript-eslint', 'import'],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    rules: {
      // Tu peux ajouter ou modifier des règles ici
      'react/react-in-jsx-scope': 'off', // Pas nécessaire avec React 17+
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  