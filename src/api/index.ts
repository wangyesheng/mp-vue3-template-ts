import request from '@/utils/request'

export async function loginRes(data: ILoginReqData): Promise<IUserInfo> {
  return request({
    url: '/api/user/account_login',
    method: 'post',
    data,
  })
}

export async function getUserInfoRes(): Promise<IUserInfo> {
  return request({
    url: '/api/user/info',
    method: 'get',
  })
}

export async function getOrdersRes(data: IPageParams): Promise<IPageData<IOrderItem>> {
  return request({
    url: '/api/order/list',
    method: 'get',
    data,
  })
}

export async function getOrderInfoRes(order_id: number | string): Promise<IOrderItem> {
  return request({
    url: '/api/order/detail',
    method: 'get',
    data: {
      order_id,
    },
  })
}

export async function startWorkRes(data: OrderReqData): Promise<any> {
  return request({
    url: '/api/order/start',
    method: 'post',
    data,
  })
}
