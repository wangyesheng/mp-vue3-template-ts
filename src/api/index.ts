import request from '@/utils/request'

export function loginRes(data: ILoginReqData): Promise<IUserInfo> {
  return request({
    url: '/api/user/account_login',
    method: 'post',
    data,
  })
}

export function getUserInfoRes(): Promise<IUserInfo> {
  return request({
    url: '/api/user/info',
    method: 'get',
  })
}

export function getOrdersRes(data: IPageParams): Promise<IPageData<IOrderItem>> {
  return request({
    url: '/api/order/list',
    method: 'get',
    data,
  })
}

export function getOrderInfoRes(order_id: number | string): Promise<IOrderItem> {
  return request({
    url: '/api/order/detail',
    method: 'get',
    data: {
      order_id,
    },
  })
}

export function startWorkRes(data: OrderReqData): Promise<any> {
  return request({
    url: '/api/order/start',
    method: 'post',
    data,
  })
}

export function completeWorkRes(data: OrderReqData): Promise<any> {
  return request({
    url: '/api/order/complete',
    method: 'post',
    data,
  })
}

export function getAfterSaleTimelineRes(aftersale_id: string): Promise<IStepInfo[]> {
  return request({
    url: '/api/order/get_aftersale_timeline',
    method: 'get',
    data: {
      aftersale_id,
    },
  })
}

export function getAfterSaleDetailRes(aftersale_id: string): Promise<IAfterSaleInfo> {
  return request({
    url: '/api/order/get_aftersale',
    method: 'get',
    data: {
      aftersale_id,
    },
  })
}

export function startHandleAfterSaleRes(aftersale_id: number): Promise<any> {
  return request({
    url: '/api/order/store_handle_aftersale',
    method: 'post',
    data: {
      aftersale_id,
    },
  })
}

export function completeHandleAfterSaleRes(aftersale_id: number): Promise<any> {
  return request({
    url: '/api/order/handle_aftersale_done',
    method: 'post',
    data: {
      aftersale_id,
    },
  })
}
