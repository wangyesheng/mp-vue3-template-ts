import { checkLoginRes, decryUserPhoneRes } from '@/api'
import { useAuthStore } from '@/stores/auth'

export function useLogin(cb?: () => void) {
  const appStore = useAuthStore()
  const bindMobileVisible = ref(false)
  let bindMobileUserProfile: Record<string, any> = {}

  async function checkLogin(phoneInfo: any, openid: string) {
    const reqData = {
      openid,
      nickname: bindMobileUserProfile.current.nickName,
      avatar: bindMobileUserProfile.current.avatarUrl,
      mobile: phoneInfo.phoneNumber,
    }
    const { userinfo: { token } } = await checkLoginRes(reqData)
    appStore.setAppToken(token)
    await appStore.refreshAppUser()
    bindMobileVisible.value = false
    cb?.()
  }

  async function getPhoneNumber(result: { detail: GetPhoneNumberDetail }) {
    const { detail: { encryptedData: encrypted_data, iv } } = result
    const { data, openid } = await decryUserPhoneRes({
      encrypted_data,
      iv,
      code: bindMobileUserProfile.code,
    })
    await checkLogin(JSON.parse(data), openid)
  }

  async function login() {
    uni.showLoading({
      title: '授权登录中...',
      mask: true,
    })
    try {
      const [{ userInfo }, code] = await Promise.all([
        new Promise<UniApp.GetUserProfileRes>((resolve, reject) => {
          uni.getUserProfile({
            provider: 'weixin',
            desc: '用于完善用户资料',
            success: resolve,
            fail: reject,
          })
        }),
        new Promise<string>((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: ({ code: loginCode }) => resolve(loginCode),
            fail: reject,
          })
        }),
      ])

      if (userInfo && code) {
        bindMobileUserProfile = {
          current: userInfo,
          code,
        }
        bindMobileVisible.value = true
      }
    }
    catch (error) {
      console.log('debugger::error_login', error)
      uni.showToast({
        title: '微信登录授权失败',
        icon: 'none',
      })
    }
    finally {
      uni.hideLoading()
    }
  }

  return {
    bindMobileVisible,
    login,
    getPhoneNumber,
  }
}
