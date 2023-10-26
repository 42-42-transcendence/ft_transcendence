module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier' : ['error', {printWidth: 120}],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "object-property-newline": ["error", { "allowAllPropertiesOnSameLine": false }], // 객체의 프로퍼티가 여러줄일 경우, 첫번째 프로퍼티는 첫줄에, 나머지는 각각 한줄씩
    "camelcase": ["error", { "properties": "never" }], // 카멜케이스 강제
    "space-in-parens": [2, "never"],// 괄호`()` 안에 공백을 추가하지 않습니다.
    "indent": ["error", "tab", { "SwitchCase": 1, "ignoredNodes": ["PropertyDefinition"] }], // 탭으로 분리(ide에서 4로 설정할 것), 데코레이터 이후의 노드는 무시
  },
};
