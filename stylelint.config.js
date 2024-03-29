module.exports = {
  defaultSeverity: 'error',
  extends: ['stylelint-config-standard'],
  rules: {
    'no-duplicate-selectors': null,
    'number-leading-zero': 'never',
    'block-no-empty': null,
    'selector-class-pattern': null,
    'declaration-block-no-redundant-longhand-properties': [true, { ignoreShorthands: ['/flex/'] }],
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'no-empty-source': null,
    'font-family-no-missing-generic-family-keyword': [
      true,
      {
        ignoreFontFamilies: ['PingFangSC-Regular', 'PingFangSC-Medium', 't'],
      },
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'function-url-quotes': null,
    'max-line-length': null,
    'at-rule-empty-line-before': ['always', { ignore: ['after-comment'] }],
    'declaration-colon-newline-after': null,
    'no-descending-specificity': null,
    'selector-type-no-unknown': null,
    'color-function-notation': 'legacy',
    'value-keyword-case': null,
    'property-no-unknown': [true, { checkPrefixed: true }],
    'import-notation': 'string',
  },
  overrides: [
    {
      files: ['**/*.html', '**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
};
