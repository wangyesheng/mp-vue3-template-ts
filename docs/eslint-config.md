# ESLint 配置说明

> 文件：`eslint.config.mjs`

## 技术选型

| 库 | 职责 |
|---|---|
| `@icebreakers/eslint-config` | 基于 `@antfu/eslint-config` 的预设，内置 vue、typescript、unicorn、perfectionist 等插件 |
| `eslint-config-prettier` | 关闭所有与 Prettier 格式化冲突的 ESLint 规则，放在最后执行 |

**职责分工原则**：ESLint 管代码逻辑与结构，Prettier 管代码格式。

---

## 整体结构

```js
icebreaker(
  预设开关,      // 控制哪些插件/规则集生效
  自定义规则覆盖, // 覆盖预设中的具体规则
  prettierConfig  // 必须放最后，关闭与 Prettier 冲突的规则
)
```

---

## 预设开关

```js
{
  vue: true,
  tailwindcss: false,
  weapp: true,
  formatters: false,
  typescript: { tsconfigPath: undefined },
  ignores: [...],
  cache: true,
  cacheLocation: '.eslintcache',
}
```

| 选项 | 值 | 说明 |
|---|---|---|
| `vue` | `true` | 启用 `eslint-plugin-vue`，检查 `.vue` 文件语法与结构 |
| `tailwindcss` | `false` | 关闭 Tailwind 类名校验。类名排序已由 `prettier-plugin-tailwindcss` 处理；开启后每次验证都会重载 `tailwind.config.ts` 解析全量类名，是 ESLint 变慢的主要原因 |
| `weapp` | `true` | 启用微信小程序相关规则，适配 uni-app 小程序端语法 |
| `formatters` | `false` | 关闭 ESLint 内置的格式化插件（如 `eslint-plugin-prettier`），格式化完全交给 Prettier |
| `typescript.tsconfigPath` | `undefined` | 不传 tsconfig 路径，禁用需要完整类型信息的慢速规则（如 `@typescript-eslint/no-unsafe-*` 系列），避免 ESLint 在每次校验时做完整类型推断 |
| `cache` | `true` | 开启文件级缓存，缓存文件存于 `.eslintcache`。**注意**：此缓存仅对 CLI（`pnpm lint`）生效，VS Code ESLint 扩展不走这个缓存 |
| `ignores` | 数组 | 排除无需 lint 的路径，避免对构建产物和声明文件做无意义检查 |

### ignores 排除路径

```
dist/**          构建产物
node_modules/**  依赖包
**/*.d.ts        TypeScript 声明文件
unpackage/**     uni-app 原生打包目录
*.config.ts      项目配置文件
*.config.js      项目配置文件
```

---

## 规则覆盖

### 关闭的规则

#### 性能相关

| 规则 | 关闭原因 |
|---|---|
| `unicorn/no-instanceof-builtins` | 小程序运行环境无跨 iframe / realm 场景，规则无实际收益；且在性能分析中占规则执行时间的 15% |
| `perfectionist/sort-imports` | uni-app 项目中 import 顺序约束意义不大；规则运行时需解析模块路径，占规则执行时间的 10% |

#### 风格 / 冲突相关

| 规则 | 关闭原因 |
|---|---|
| `no-console` | 开发调试需要 `console.log` |
| `one-var` | 强制一条语句声明多变量，属个人风格偏好 |
| `eqeqeq` | 允许使用 `==` / `!=`，不强制三等号 |
| `antfu/if-newline` | 与 Prettier 的 `curly` 换行格式冲突，关闭后由 Prettier 统一处理 |

---

### 开启的规则

#### `vue/block-order` — Vue 文件块顺序

强制 `.vue` 文件的块按以下顺序排列：

```
template → script → style
```

#### `vue/attribute-hyphenation` — 属性名 kebab-case

组件属性名强制使用 kebab-case：

```html
<!-- ❌ -->
<nut-icon customColor="#333" />

<!-- ✅ -->
<nut-icon custom-color="#333" />
```

#### `vue/component-name-in-template-casing` — 组件标签 kebab-case

模板中的组件标签强制使用 kebab-case：

```html
<!-- ❌ -->
<AppContainer />
<MonthSwitcher />

<!-- ✅ -->
<app-container />
<month-switcher />
```

> **`registeredComponentsOnly: false`**：项目使用 `@uni-helper/vite-plugin-uni-components` 自动导入组件，ESLint 无法感知自动注册的组件，默认只检查显式注册（`components: { ... }`）的组件。关闭此限制后，规则会检查模板中所有 PascalCase 标签。

#### `vue/attributes-order` — 属性排列顺序

属性按以下类别从上到下排列，同类别内部不强制字母顺序：

| 顺序 | 类别 | 包含 |
|---|---|---|
| 1 | `DEFINITION` | `is`、`v-is` |
| 2 | `LIST_RENDERING` | `v-for` |
| 3 | `CONDITIONALS` | `v-if`、`v-else-if`、`v-else`、`v-show`、`v-cloak` |
| 4 | `RENDER_MODIFIERS` | `v-once`、`v-pre` |
| 5 | `GLOBAL` | `id` |
| 6 | `UNIQUE` | `ref`、`key` |
| 7 | `SLOT` | `v-slot`、`slot`、`#default` |
| 8 | `TWO_WAY_BINDING` | `v-model` |
| 9 | `OTHER_DIRECTIVES` | 其他自定义指令 |
| 10 | `ATTR_SHORTHAND_BOOL` | 简写布尔属性（`disabled`、`readonly`、`block` 等） |
| 11 | `ATTR_STATIC` | 静态属性（`class`、`style`、`type`、`placeholder` 等） |
| 12 | `ATTR_DYNAMIC` | 动态绑定属性（`:foo="bar"`、`v-bind:foo`） |
| 13 | `EVENTS` | `@click`、`v-on` |
| 14 | `CONTENT` | `v-text`、`v-html` |

示例：

```html
<nut-input
  v-if="show"
  ref="inputRef"
  v-model="value"
  block
  class="my-input"
  placeholder="请输入"
  :maxlength="20"
  @change="handleChange"
/>
```

---

## VS Code 集成说明

相关配置在 `.vscode/settings.json` 中：

```jsonc
{
  // 只在保存时触发 ESLint 校验（而非每次输入）
  "eslint.run": "onSave",

  // 保存时不自动执行 ESLint 修复，避免每次保存计算修复方案耗时 20s+
  // 如需修复，手动运行：pnpm format
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "never"
  }
}
```

### 手动修复

需要应用 ESLint 修复（属性排序、kebab-case 等）时，运行：

```bash
pnpm format
```

该命令依次执行：`eslint --fix` → `prettier --write`。

---

## 性能说明

ESLint 使用 `@icebreakers/eslint-config` 预设会加载 10+ 个插件，**首次启动约需 10-15 秒**（冷启动开销），属正常现象。VS Code ESLint language server 启动后会常驻内存，后续校验速度正常。

如需进一步提速，可临时将 `weapp: true` 改为 `false`，减少一个插件的加载。
