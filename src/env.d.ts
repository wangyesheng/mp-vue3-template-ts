/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

// 微信小程序 getPhoneNumber 事件
interface GetPhoneNumberDetail {
  errMsg?: string
  code?: string
  encryptedData?: string
  encrypted_data?: string
  iv?: string
}
