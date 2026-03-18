import { icebreaker } from '@icebreakers/eslint-config'
import prettierConfig from 'eslint-config-prettier'

export default icebreaker(
  {
    vue: true,
    tailwindcss: {
      tailwindConfig: './tailwind.config.ts',
    },
    weapp: true,
    // 关闭通过 ESLint 运行格式化的插件，格式化交给 Prettier 处理
    formatters: false,
    // 关闭需要 TypeScript 类型信息的慢速规则
    typescript: {
      tsconfigPath: undefined,
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.d.ts',
      'unpackage/**',
      '*.config.ts',
      '*.config.js',
    ],
  },
  {
    // 规则可以在这里禁用
    rules: {
      'better-tailwindcss/no-unknown-classes': 'off',
      'no-console': 'off',
      'one-var': 'off',
      'eqeqeq': 'off', // 允许使用 == 和 != 比较运算符
    },
  },
  // 必须放在最后，关闭所有与 Prettier 冲突的 ESLint 格式化规则
  prettierConfig,
)
