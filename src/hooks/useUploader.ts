import { toast } from '@/utils/uni'
import { useAppStore } from '@/stores/app'

const baseUrl = import.meta.env.VITE_BASE_API
const uploadUrl = `${baseUrl}/api/common/upload`

export function useUploader() {
  const { appToken } = storeToRefs(useAppStore())

  function upload(filePath: string): Promise<{ fullUrl: string; url: string }> {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: uploadUrl,
        filePath,
        name: 'file',
        header: {
          token: appToken.value,
          'content-type': 'multipart/form-data',
        },
        success: (result) => {
          try {
            const { code, data, msg } = JSON.parse(result.data)
            if (code !== 1) {
              toast(msg)
              reject(new Error(msg || '上传失败'))
            } else {
              resolve({
                fullUrl: baseUrl + data.url,
                url: data.url,
              })
            }
          } catch (e) {
            reject(e)
          }
        },
        fail: (uploadFileErr) => {
          console.log('upload::error', uploadFileErr)
          toast('上传失败！')
          reject(uploadFileErr)
        },
      })
    })
  }

  return { upload }
}
