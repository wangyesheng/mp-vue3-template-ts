const AUTH_KEY = 'auth_user'

interface UserInfo {
  phone: string
  token: string
  nickname?: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref<UserInfo | null>(
    uni.getStorageSync(AUTH_KEY) || null,
  )

  const isLoggedIn = computed(() => !!userInfo.value?.token)

  function login(info: UserInfo) {
    userInfo.value =info
    uni.setStorageSync(AUTH_KEY, info)
  }

  function logout() {
    userInfo.value = null
    uni.removeStorageSync(AUTH_KEY)
    uni.reLaunch({ url: '/pages/login/index' })
  }

  function setAppToken(token: string) {
    uni.setStorageSync('app_token', token)
  }

  async function refreshAppUser() {}

  return { userInfo, isLoggedIn, login, logout, setAppToken, refreshAppUser }
})
