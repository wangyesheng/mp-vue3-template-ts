# TypeScript `declare` 关键字详解

## 核心概念

`declare` 的作用是告诉 TypeScript：**"这个东西是存在的，但它的实现不在这里，你只需要知道它的类型"**。

- 写在 `.ts` 文件中 → 局部生效，需要 `export` / `import`
- 写在 `.d.ts` 文件中且没有任何 `import/export` → **全局生效**，整个项目无需 import 直接使用

---

## 为什么需要 `declare`

TypeScript 是强类型的，当你使用一个"外来"的变量或模块时（比如第三方 JS 库、浏览器 API、运行时注入的全局变量），TS 不知道它们的类型，就会报错。`declare` 就是专门用来"登记"这些外来东西的类型的。

```typescript
// ❌ 不写 declare，TS 报错：Cannot find name 'wx'
wx.showToast({ title: '成功' })

// ✅ 写了 declare，TS 认识了 wx
declare const wx: {
  showToast(options: { title: string }): void
}
wx.showToast({ title: '成功' }) // 正常
```

---

## 各种 `declare` 用法

### 1. `declare const / let / var` — 声明全局变量

**场景**：运行时存在的全局变量（如 CDN 引入的库、环境注入的变量）

```typescript
// 假设 HTML 里通过 <script> 引入了 jQuery，TS 不认识 $
declare const $: (selector: string) => {
  hide(): void
  show(): void
}

// 现在可以用了
$('#app').hide()
```

```typescript
// 声明环境变量（如 process.env）
declare const __APP_VERSION__: string

console.log(__APP_VERSION__) // '1.0.0'
```

---

### 2. `declare function` — 声明全局函数

**场景**：运行时存在但没有 TS 类型的全局函数

```typescript
// 声明一个小程序原生方法
declare function requirePlugin(pluginId: string): any

// 使用
const plugin = requirePlugin('myPlugin')
```

```typescript
// 如果不用 declare，直接写函数声明
function requirePlugin(pluginId: string): any  // ❌ 这是函数实现，不是声明
```

---

### 3. `declare class` — 声明全局类

**场景**：第三方 JS 库暴露的全局类

```typescript
declare class EventEmitter {
  on(event: string, listener: () => void): this
  off(event: string, listener: () => void): this
  emit(event: string): void
}

// 现在 TS 认识这个类了
const emitter = new EventEmitter()
emitter.on('login', () => {})
```

---

### 4. `declare interface` — 声明全局接口

**场景**：在 `.d.ts` 文件中定义全局复用的接口，整个项目无需 import

```typescript
// global.d.ts（文件内无任何 import/export）

declare interface IResponse<T = any> {
  code: number
  message: string
  data: T
}

declare interface IPage {
  page: number
  limit: number
}
```

```typescript
// 任意 .ts 文件中，无需 import 直接用
async function getList(): Promise<IResponse<string[]>> {
  // ...
}

function fetchData(params: IPage) {
  // ...
}
```

> **注意**：这就是你的 `model.d.ts` 里没有 `export` 却能全局使用的原因——文件内没有任何 `import/export`，TS 将它识别为全局声明文件。

---

### 5. `declare type` — 声明全局类型别名

**场景**：全局通用的类型，如状态码、主题色等

```typescript
// global.d.ts

declare type Nullable<T> = T | null

declare type Status = 'pending' | 'success' | 'error'

declare type ID = number | string
```

```typescript
// 任意文件中直接使用
const userId: Nullable<number> = null
const status: Status = 'pending'
```

---

### 6. `declare namespace` — 声明命名空间

**场景**：为某个全局对象的属性和方法统一声明类型（常见于 jQuery、微信小程序 API）

```typescript
// 声明微信小程序的 wx 对象
declare namespace wx {
  interface ShowToastOptions {
    title: string
    icon?: 'success' | 'error' | 'none'
    duration?: number
  }

  function showToast(options: ShowToastOptions): void
  function hideToast(): void
  function navigateTo(options: { url: string }): void
}

// 使用
wx.showToast({ title: '操作成功', icon: 'success' })
wx.navigateTo({ url: '/pages/home/index' })
```

与直接 `declare const wx: {...}` 相比，`namespace` 更适合**属性很多**的全局对象，结构更清晰。

---

### 7. `declare module` — 声明模块

**场景**：为没有类型的第三方模块补充类型，或扩展已有模块

#### 场景一：为纯 JS 库补类型

```typescript
// 某个没有类型定义的 JS 库
declare module 'some-js-lib' {
  export function doSomething(val: string): number
  export const version: string
}

// 使用
import { doSomething } from 'some-js-lib'
doSomething('hello') // TS 不报错了
```

#### 场景二：让 TS 认识非 JS 文件（项目中的 env.d.ts）

```typescript
// 告诉 TS：所有 .vue 文件导入后是一个 Vue 组件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

// 告诉 TS：.svg 文件导入后是字符串
declare module '*.svg' {
  const content: string
  export default content
}

// 告诉 TS：.json 文件的类型
declare module '*.json' {
  const value: any
  export default value
}
```

```typescript
// 没有上面的声明，TS 会报错：
import App from './App.vue'   // ❌ 找不到模块
import logo from './logo.svg' // ❌ 找不到模块

// 有了声明后正常
import App from './App.vue'   // ✅
import logo from './logo.svg' // ✅ logo 是 string 类型
```

#### 场景三：扩展已有模块的类型（模块增强）

```typescript
// 给 Vue 实例添加自定义属性
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: (url: string) => Promise<any>
    $filters: {
      formatDate: (date: string) => string
    }
  }
}

// 现在可以在 .vue 文件中用
this.$http('/api/user')
this.$filters.formatDate('2024-01-01')
```

---

## 全局生效 vs 模块生效

这是最容易混淆的地方：

| 文件内容 | 效果 |
|---------|------|
| `.d.ts` 文件内**没有任何** `import` / `export` | 全局声明，整个项目无需 import 直接用 |
| `.d.ts` 文件内**有** `import` 或 `export` | 变成模块文件，需要 import 才能用 |
| `.ts` 普通文件 | 需要 export 后再 import 使用 |

```typescript
// ✅ global.d.ts — 全局生效（文件内没有 import/export）
declare interface IUser {
  name: string
}

// 任意文件直接用
const user: IUser = { name: 'Tom' }
```

```typescript
// ❌ 一旦文件内加了 import，就变成模块了，全局声明失效
import type { Ref } from 'vue'  // 加了这行

declare interface IUser {  // 这个接口不再全局了，需要 export + import 才能用
  name: string
}
```

```typescript
// ✅ 解决方案：用 declare global 包裹，强制全局生效
import type { Ref } from 'vue'

declare global {
  interface IUser {
    name: string
  }
}

// 现在 IUser 重新是全局的了
```

---

## 总结

| 关键字 | 用途 | 典型场景 |
|-------|------|---------|
| `declare const/let` | 全局变量 | CDN 引入的库、环境变量 |
| `declare function` | 全局函数 | 运行时注入的函数 |
| `declare class` | 全局类 | 第三方 JS 暴露的类 |
| `declare interface` | 全局接口 | 项目通用数据结构 |
| `declare type` | 全局类型别名 | 通用类型如 `Nullable<T>` |
| `declare namespace` | 全局命名空间 | 复杂全局对象如 `wx`、`uni` |
| `declare module` | 模块声明/扩展 | `.vue` 文件类型、第三方无类型库 |
