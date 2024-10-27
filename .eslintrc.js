module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'property',
        'format': ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'] // Permite snake_case
      }
    ]
  }
};