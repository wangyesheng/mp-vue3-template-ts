export const USER_KEY = 'app_user'
export const TOKEN_KEY = 'app_token'

export const useAppStore = defineStore('auth', () => {
  const userInfo = ref<IUserInfo | null>(uni.getStorageSync(USER_KEY) || null)
  const appToken = ref<string | null>(uni.getStorageSync(TOKEN_KEY) || null)

  function setAppToken(token: string | null = null) {
    appToken.value = token
    uni.setStorageSync(TOKEN_KEY, token)
  }

  function setAppUser(user: IUserInfo | null = null) {
    userInfo.value = user
    uni.setStorageSync(USER_KEY, user)
  }

  function logout() {
    setAppToken()
    setAppUser()
    uni.reLaunch({ url: '/pages/login/index' })
  }

  async function refreshAppUser() {}

  return { userInfo, appToken, logout, setAppToken, setAppUser, refreshAppUser }
})
