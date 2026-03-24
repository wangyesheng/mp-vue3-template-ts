import { useAppStore } from '@/stores/app'
import http from './http'
import { toast } from './uni'

type HttpMethodKey = 'get' | 'post' | 'put' | 'delete'

interface RequestOptions {
  url: string
  method: string
  data?: Record<string, any>
}

interface ResponseError {
  statusCode?: number
  data?: any
  code?: number
  msg?: string
}

http.setConfig({
  baseUrl: import.meta.env.VITE_BASE_API,
  showLoading: false,
})

http.interceptor.request = (config) => {
  const token = uni.getStorageSync('app_token')
  if (token) {
    config.header = config.header ?? {}
    config.header.token = token
  }
  return config // 如果 return 一个 false 值，则会取消本次请求
}

// 响应拦截器：从 { code, data } 中提取业务数据
// 拦截器返回的 data 就是 .then(result) 接收到的值
// 所以泛型 T 代表的是 data 的类型，而非原始 HTTP 响应
http.interceptor.response = (result: { code: number; data: unknown }) => {
  const { code, data } = result
  if (code === 1) {
    return data // ← .then(result: T) 收到的是这里
  } else {
    return false // ← 进入 .catch()
  }
}

function request<T = unknown>({ url, method, data = {} }: RequestOptions): Promise<T> {
  const methodKey = method.toLowerCase() as HttpMethodKey
  return new Promise<T>((resolve, reject) => {
    http[methodKey](url, data)
      .then((result: T) => {
        resolve(result)
      })
      .catch((error: ResponseError) => {
        console.log('request::error', error)
        let errorData: ResponseError = error
        if (error.statusCode) {
          // http 网络请求报错
          console.log(error.data)
          errorData = error.data
        }
        // 如果 errMsg 有值代表是 uni.request 原生方法报错了
        // request:fail abort => 取消请求
        // request:fail timeout => 请求超时
        if (errorData.code === 401) {
          toast('请授权登录')
          const appStore = useAppStore()
          appStore?.logout()
        } else {
          uni.showModal({
            title: '提示',
            content: errorData.msg,
            confirmText: '确定',
            showCancel: false,
            success: () => {},
          })
        }
        reject(errorData)
      })
  })
}

export default request
