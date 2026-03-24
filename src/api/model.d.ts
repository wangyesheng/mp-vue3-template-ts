interface ILoginReqData {
  account: string
  password: string
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

interface IPage {
  page: number
  limit: number
}
