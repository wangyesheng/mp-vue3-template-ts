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
