/**
 * Prettier Configuration
 * 代码格式化配置
 */

module.exports = {
  // 行宽
  printWidth: 100,

  // 缩进空格数
  tabWidth: 2,

  // 使用空格缩进
  useTabs: false,

  // 语句末尾加分号
  semi: true,

  // 使用单引号
  singleQuote: true,

  // 对象属性引号
  quoteProps: 'as-needed',

  // JSX 使用单引号
  jsxSingleQuote: true,

  // 尾随逗号
  trailingComma: 'es5',

  // 对象大括号内部空格
  bracketSpacing: true,

  // 多行 JSX 元素 > 符号放最后
  bracketSameLine: false,

  // 箭头函数参数括号
  arrowParens: 'always',

  // 格式化范围
  rangeStart: 0,
  rangeEnd: Infinity,

  // 是否需要 pragma
  requirePragma: false,

  // 是否自动插入 pragma
  insertPragma: false,

  // 使用特定解析器
  proseWrap: 'preserve',

  // HTML 空白敏感性
  htmlWhitespaceSensitivity: 'css',

  // Vue 文件缩进 <script> 和 <style>
  vueIndentScriptAndStyle: false,

  // 换行符
  endOfLine: 'lf',

  // 是否格式化嵌入式代码
  embeddedLanguageFormatting: 'auto',

  // 单个属性的输出
  singleAttributePerLine: false,

  // 覆盖配置
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: ['*.tsx', '*.jsx'],
      options: {
        jsxSingleQuote: false,
      },
    },
  ],
};
