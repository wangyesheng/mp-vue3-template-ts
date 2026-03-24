import { icebreaker } from '@icebreakers/eslint-config'
import prettierConfig from 'eslint-config-prettier'

export default icebreaker(
  {
    vue: true,
    // 关闭 ESLint 的 tailwindcss 插件：类名排序已由 prettier-plugin-tailwindcss 处理
    // 开启会在每次保存时重新加载 tailwind.config 解析全部类名，是 ESLint 慢的主要原因
    tailwindcss: false,
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
    // 开启 ESLint 缓存，大幅提升重复检查速度
    cache: true,
    cacheLocation: '.eslintcache',
  },
  {
    rules: {
      // 关闭耗时规则：这两条占规则总执行时间的 25%，且对本项目实际价值有限
      // 禁止用 instanceof 检查内置类型，因为跨 iframe/realm 时会失效
      'unicorn/no-instanceof-builtins': 'off',
      // 强制 import 语句按特定顺序排列（内置模块 → 第三方 → 本地文件）：
      'perfectionist/sort-imports': 'off',
      'no-console': 'off',
      'one-var': 'off',
      eqeqeq: 'off', // 允许使用 == 和 != 比较运算符
      'antfu/if-newline': 'off', // 关闭与 Prettier 冲突的换行规则，由 curly 统一处理
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'], // 强制顺序：template → script → style
        },
      ],
      // camelCase 属性名强制转为 kebab-case，如 customColor → custom-color
      'vue/attribute-hyphenation': ['error', 'always'],
      // 组件名称在模板中强制使用 kebab-case，如 MyComponent → my-component
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      // 属性排序：静态属性在前，动态属性在后
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION', // is, v-is
            'LIST_RENDERING', // v-for
            'CONDITIONALS', // v-if, v-else-if, v-else, v-show, v-cloak
            'RENDER_MODIFIERS', // v-once, v-pre
            'GLOBAL', // id
            'UNIQUE', // ref, key
            'SLOT', // v-slot, slot, #default
            'TWO_WAY_BINDING', // v-model
            'OTHER_DIRECTIVES', // 其他自定义指令
            'ATTR_SHORTHAND_BOOL', // 简写布尔属性（disabled, readonly, block 等）
            'ATTR_STATIC', // 静态属性（class, style, type, placeholder 等）
            'ATTR_DYNAMIC', // 动态绑定属性（:foo="bar"、v-bind:foo）
            'EVENTS', // @click, v-on
            'CONTENT', // v-text, v-html
          ],
          alphabetical: false, // 不在每类内按字母排序
        },
      ],
    },
  },
  // 必须放在最后，关闭所有与 Prettier 冲突的 ESLint 格式化规则
  prettierConfig,
)
