import { APP_TOKEN_KEY } from './const'

export function toast(message: string) {
  uni.showToast({
    icon: 'none',
    title: message,
    duration: 3000,
  })
}

export function copy(content: string, tips = '复制成功') {
  uni.setClipboardData({
    data: content,
    success() {
      toast(tips)
    },
  })
}

export function navTo(url: string, needToken = true) {
  if (needToken) {
    const token = uni.getStorageSync(APP_TOKEN_KEY) || {}
    if (!token) {
      return toast('请授权登录')
    }
  }

  uni.navigateTo({
    url,
  })
}

export function switchTab(url: string, needToken = true) {
  if (needToken) {
    const token = uni.getStorageSync(APP_TOKEN_KEY) || {}
    if (!token) {
      return toast('请授权登录')
    }
  }

  uni.switchTab({ url })
}

export function previewImage(urls: any[]) {
  uni.previewImage({
    urls,
  })
}

export function callPhone(phoneNumber: string) {
  if (phoneNumber) {
    uni.makePhoneCall({
      phoneNumber,
    })
  }
}

export function setNavigationBarTitle(title: string) {
  uni.setNavigationBarTitle({ title })
}

export function pathToBase64(filePath: string) {
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: (res) => {
        // 根据文件后缀判断 mime 类型
        const ext = filePath.split('.').pop()?.toLowerCase()
        const mimeTypes: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          webp: 'image/webp',
        }
        const mime = ext ? mimeTypes[ext] : 'image/png'
        resolve(`data:${mime};base64,${res.data}`)
      },
      fail: reject,
    })
  })
}

export function addHtmlClassName(htmlString: string) {
  if (!htmlString || typeof htmlString !== 'string') {
    return htmlString
  }
  return htmlString
    .replace(/<div/g, '<div class="div"')
    .replace(/<p/g, '<p class="p"')
    .replace(/<strong/g, '<strong class="strong"')
    .replace(/<h1/g, '<h1 class="h1"')
    .replace(/<h2/g, '<h2 class="h2"')
    .replace(/<h3/g, '<h3 class="h3"')
    .replace(/<h4/g, '<h4 class="h4"')
    .replace(/<h5/g, '<h5 class="h5"')
    .replace(/<h6/g, '<h6 class="h6"')
    .replace(/<ul/g, '<ul class="ul"')
    .replace(/<li/g, '<li class="li"')
    .replace(/<span/g, '<span class="span"')
    .replace(/<img/g, '<img class="img"')
}
