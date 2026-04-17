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

export function getInvoiceOverviewRes(month: string): Promise<IInvoiceOverviewInfo> {
  return request({
    url: '/api/invoice/overview',
    method: 'get',
    data: {
      month,
    },
  })
}

export function getInvoiceListRes(data: IPageParams): Promise<IPageData<IInvoiceItem>> {
  return request({
    url: '/api/invoice/list',
    method: 'get',
    data,
  })
}

export function getInvoiceDetailRes(order_ids: string): Promise<IInvoiceApplyInfo> {
  return request({
    url: '/api/invoice/detail',
    method: 'get',
    data: {
      order_ids,
    },
  })
}

export function applyInvoiceRes(data: any): Promise<any> {
  return request({
    url: '/api/invoice/apply',
    method: 'post',
    data,
  })
}

export function getOrderSummaryRes(month: string): Promise<ISummaryInfo> {
  return request({
    url: '/api/order/overview',
    method: 'get',
    data: {
      month,
    },
  })
}

export function getOrderSummaryListRes(data: IPageParams): Promise<any> {
  return request({
    url: '/api/order/settle_list',
    method: 'get',
    data,
  })
}
