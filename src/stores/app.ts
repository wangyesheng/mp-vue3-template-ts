import { getUserInfoRes } from '@/api'
import { APP_TOKEN_KEY, APP_USER_KEY } from '@/utils/const'

export const useAppStore = defineStore('auth', () => {
  const appToken = ref<string | null>(uni.getStorageSync(APP_TOKEN_KEY) || null)
  function setAppToken(token: string | null = null) {
    appToken.value = token
    uni.setStorageSync(APP_TOKEN_KEY, token)
  }

  const appUser = ref<IUserInfo | null>(uni.getStorageSync(APP_USER_KEY) || null)
  function setAppUser(user: IUserInfo | null = null) {
    appUser.value = user
    uni.setStorageSync(APP_USER_KEY, user)
  }

  async function refreshAppUser() {
    const user = await getUserInfoRes()
    setAppUser(user)
  }

  function logout() {
    setAppToken()
    setAppUser()
    uni.reLaunch({ url: '/pages/login/index' })
  }

  /** 等页面 navigateBack 后，列表需要强制刷新时置位 */
  const needRefresh = ref(false)
  function markNeedRefresh() {
    needRefresh.value = true
  }

  /** 首页 onShow 调用：若为 true 则清空并返回 true，只消费一次 */
  function checkNeedRefresh() {
    if (!needRefresh.value) return false
    needRefresh.value = false
    return true
  }

  return {
    appUser,
    appToken,
    logout,
    setAppToken,
    setAppUser,
    refreshAppUser,
    markNeedRefresh,
    checkNeedRefresh,
  }
})
