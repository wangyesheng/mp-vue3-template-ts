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

export async function loginRes(data: ILoginReqData): Promise<IUserInfo> {
  return request({
    url: '/api/user/account_login',
    method: 'post',
    data,
  })
}

export async function getOrdersRes(data: IPage): Promise<any> {
  return request({
    url: 'api/order/list',
    method: 'get',
    data,
  })
}
