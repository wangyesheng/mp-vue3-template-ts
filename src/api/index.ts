import request from '@/utils/request'

interface DecryUserPhoneParams {
  encrypted_data?: string
  iv?: string
  code?: string
}

interface DecryUserPhoneResult {
  data: string
  openid: string
}

interface CheckLoginParams {
  openid: string
  nickname: string
  avatar: string
  mobile: string
}

interface CheckLoginResult {
  userinfo: {
    token: string
  }
}

export async function decryUserPhoneRes(data: DecryUserPhoneParams): Promise<DecryUserPhoneResult> {
  return request({
    url: '',
    method: 'post',
    data,
  })
}

export async function checkLoginRes(data: CheckLoginParams): Promise<CheckLoginResult> {
  return request({
    url: '',
    method: 'post',
    data,
  })
}
