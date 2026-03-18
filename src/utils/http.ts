import { merge } from 'lodash-es'
import test from './test'

interface HttpConfig {
  baseUrl: string
  header: Record<string, string>
  method: string
  dataType: string
  responseType: string
  showLoading: boolean
  loadingText: string
  loadingTime: number
  timer: ReturnType<typeof setTimeout> | null
  originalData: boolean
  loadingMask: boolean
}

interface HttpOptions {
  url: string
  method?: string
  data?: Record<string, any>
  params?: Record<string, any>
  header?: Record<string, string>
  dataType?: string
  responseType?: string
  complete?: (response: any) => void
}

interface HttpInterceptor {
  request: ((options: HttpOptions) => HttpOptions | false) | null
  response: ((response: any) => any | false) | null
}

class Request {
  config: HttpConfig
  interceptor: HttpInterceptor
  currentRequestTaskStack: Record<string, UniApp.RequestTask>
  options: HttpOptions = { url: '' }

  get!: (url: string, data?: Record<string, any>, header?: Record<string, string>) => Promise<any>
  post!: (url: string, data?: Record<string, any>, header?: Record<string, string>) => Promise<any>
  put!: (url: string, data?: Record<string, any>, header?: Record<string, string>) => Promise<any>
  delete!: (
    url: string,
    data?: Record<string, any>,
    header?: Record<string, string>,
  ) => Promise<any>

  constructor() {
    this.config = {
      baseUrl: '',
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      showLoading: true,
      loadingText: '请求中...',
      loadingTime: 800,
      timer: null,
      originalData: false,
      loadingMask: true,
    }

    this.currentRequestTaskStack = {}

    this.interceptor = {
      request: null,
      response: null,
    }

    this.get = (url, data = {}, header = {}) => {
      return this.request({ method: 'GET', url, header, data })
    }

    this.post = (url, data = {}, header = {}) => {
      return this.request({ url, method: 'POST', header, data })
    }

    this.put = (url, data = {}, header = {}) => {
      return this.request({ url, method: 'PUT', header, data })
    }

    this.delete = (url, data = {}, header = {}) => {
      return this.request({ url, method: 'DELETE', header, data })
    }
  }

  // 设置全局默认配置
  setConfig(customConfig: Partial<HttpConfig>) {
    // 深度合并对象，使用 lodash-es merge 避免对象深层属性丢失
    this.config = merge(this.config, customConfig)
  }

  // 主要请求部分
  request(options: HttpOptions): Promise<any> {
    // 检查请求拦截
    if (this.interceptor.request && typeof this.interceptor.request === 'function') {
      const interceptorRequest = this.interceptor.request(options)
      if (interceptorRequest === false) {
        // 返回一个处于 pending 状态的 Promise，来取消原 promise，避免进入 then() 回调
        return new Promise(() => {})
      }
      this.options = interceptorRequest
    }

    options.dataType = options.dataType || this.config.dataType
    options.responseType = options.responseType || this.config.responseType
    options.url = options.url || ''
    options.params = options.params || {}
    options.header = Object.assign({}, this.config.header, options.header)
    options.method = options.method || this.config.method

    return new Promise((resolve, reject) => {
      options.complete = (response: any) => {
        // 请求返回后清除定时器
        clearTimeout(this.config.timer!)
        this.config.timer = null

        if (this.config.originalData) {
          if (this.interceptor.response && typeof this.interceptor.response === 'function') {
            const resInterceptors = this.interceptor.response(response)
            if (resInterceptors !== false) {
              resolve(resInterceptors)
            } else {
              reject(response)
            }
          } else {
            resolve(response)
          }
        } else {
          if (response.statusCode === 200) {
            if (this.interceptor.response && typeof this.interceptor.response === 'function') {
              const resInterceptors = this.interceptor.response(response.data)
              if (resInterceptors !== false) {
                resolve(resInterceptors)
              } else {
                reject(response.data)
              }
            } else {
              resolve(response.data)
            }
          } else {
            reject(response)
          }
        }

        delete this.currentRequestTaskStack[options.url]
      }

      // 判断 URL 是否绝对路径，不是则拼接 baseUrl
      options.url = test.url(options.url)
        ? options.url
        : this.config.baseUrl + (options.url.indexOf('/') === 0 ? options.url : `/${options.url}`)

      // 是否显示 loading（防止多个并发请求重复创建定时器）
      if (this.config.showLoading && !this.config.timer) {
        this.config.timer = setTimeout(() => {
          this.config.timer = null
        }, this.config.loadingTime)
      }

      const currentRequestTask = uni.request(
        options as UniApp.RequestOptions,
      ) as unknown as UniApp.RequestTask
      this.currentRequestTaskStack[options.url] = currentRequestTask
    })
  }
}

export default new Request()
