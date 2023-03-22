const RULES_CODES = {
  OFF: 0,
  WARN: 1,
  ERROR: 2,
}

module.exports = {
  root: true,
  extends: ['@tinkin', '@tinkin/eslint-config/react'],
  rules: {
    '@typescript-eslint/naming-convention': RULES_CODES.OFF,
    'react/react-in-jsx-scope': RULES_CODES.OFF,
    'filenames/match-regex': RULES_CODES.OFF,
  },
}
