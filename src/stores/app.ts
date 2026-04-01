import { getUserInfoRes } from '@/api'
import { APP_TOKEN_KEY, APP_USER_KEY } from '@/utils/const'

export const useAppStore = defineStore('auth', () => {
  const appUser = ref<IUserInfo | null>(uni.getStorageSync(APP_USER_KEY) || null)
  const appToken = ref<string | null>(uni.getStorageSync(APP_TOKEN_KEY) || null)

  function setAppToken(token: string | null = null) {
    appToken.value = token
    uni.setStorageSync(APP_TOKEN_KEY, token)
  }

  function setAppUser(user: IUserInfo | null = null) {
    appUser.value = user
    uni.setStorageSync(APP_USER_KEY, user)
  }

  function logout() {
    setAppToken()
    setAppUser()
    uni.reLaunch({ url: '/pages/login/index' })
  }

  async function refreshAppUser() {
    const user = await getUserInfoRes()
    setAppUser(user)
  }

  return { appUser, appToken, logout, setAppToken, setAppUser, refreshAppUser }
})
