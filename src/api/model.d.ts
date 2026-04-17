interface ILoginReqData {
  account: string
  password: string
  platform_type: string
}

interface IUserInfo {
  id: number
  user_id: number
  token: string
  username: string
  nickname: string
  mobile: string
  avatar: string
  group_id: string
}

interface IPageParams {
  page: number
  limit: number
  [key: string]: any
}

interface IPageData<T> {
  total: number
  data: T[]
}

interface IOrderItem {
  id: number
  hour_price: string
  order_sn: string
  product_name: string
  service_name: string
  vehicle_type: string
  start_front_photos: string
  start_back_photos: string
  start_side_photos: string[]
  end_front_photos: string
  end_back_photos: string
  end_side_photos: string[]
  plate_number: string
  frame_photo: string
  aftersale_type: number
  [key: string]: any
}

type OrderReqData = {
  order_id: number | string
  front_photos: string
  side_photos: string
  back_photos: string
  plate_number?: string
  frame_photo?: string
}

type OrderCarPhoto = Pick<
  OrderReqData,
  'front_photos' | 'side_photos' | 'back_photos' | 'frame_photo'
>

interface IStepInfo {
  id: number
  content: string
  createtime: string
  [key: string]: any
}

interface IAfterSaleInfo {
  id: number
  problem_desc: string
  images: string[]
  contact_name: string
  contact_phone: string
  createtime: string
  handle_status: number
  [key: string]: any
}

interface IInvoiceOverviewInfo {
  un_invoiced_amount: string
  un_invoiced_count: number
  invoiced_amount: number
  invoiced_count: number
  current_month: string
}

interface IInvoiceItem {
  id: number
  order_sn: string
  vehicle_type: string
  service_name: string
  hour_price: string
  reward_price: string
  total_amount: string
  is_special_text: string
  is_construction_text: string
  status_text: string
}

interface IInvoiceApplyInfo {
  total_number: number
  total_price: string
  invoice_info: { label: string; value: string }[]
}

interface ISummaryInfo extends IInvoiceOverviewInfo {
  total_amount: string
  hour_amount: string
  reward_amount: string
  current_month: string
}
