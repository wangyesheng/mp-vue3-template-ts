<template>
  <app-container>
    <div class="completion-page">
      <div class="section-card">
        <div class="section-head">
          <div class="section-title-wrap">
            <div class="section-dot" />
            <span class="section-title">订单详情</span>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">订单号</span>
            <span class="text-sm font-medium text-slate-700">{{ orderInfo.order_sn }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">车辆</span>
            <span class="text-sm font-medium text-slate-700">{{ orderInfo.vehicle_type }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">产品</span>
            <span class="text-sm font-medium text-slate-700">
              {{ orderInfo.product_name }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">服务</span>
            <span class="text-sm font-medium text-slate-700">
              {{ orderInfo.service_name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 施工前照片 -->
      <div class="section-card">
        <div class="section-head">
          <div class="section-title-wrap">
            <div class="section-dot" />
            <span class="section-title">上传施工前照片</span>
            <span class="section-required">必填</span>
          </div>
          <span class="section-desc">车辆前1张、车辆侧面2张、车辆后1张</span>
        </div>

        <div class="process-photos">
          <!-- 施工前 -->
          <div
            v-for="photo in beforeCarPhotos"
            :key="`${photo.type}-${photo.key}-${photo.index}`"
            class="photo-item"
            @tap="onClickImage(photo.key, photo.index, photo.type as ActionType)"
          >
            <div v-if="photo.url" class="photo-placeholder">
              <image class="preview-img" mode="aspectFill" :src="photo.url" />
            </div>

            <div v-else class="photo-placeholder">
              <div class="placeholder-icon">
                <text class="i-mdi-camera text-[#666]"></text>
              </div>
              <div class="placeholder-label">{{ photo.label }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="actionType == 'after'">
        <!-- 施工后照片 -->
        <div class="section-card">
          <div class="section-head">
            <div class="section-title-wrap">
              <div class="section-dot" />
              <span class="section-title">上传施工后照片</span>
              <span class="section-required">必填</span>
            </div>
            <span class="section-desc">车辆前1张、车辆侧面2张、车辆后1张</span>
          </div>

          <div class="process-photos">
            <div
              v-for="photo in afterCarPhotos"
              :key="`${photo.type}-${photo.key}-${photo.index}`"
              class="photo-item"
              @tap="onClickImage(photo.key, photo.index, photo.type as ActionType)"
            >
              <div v-if="photo.url" class="photo-placeholder">
                <image class="preview-img" mode="aspectFill" :src="photo.url" />
              </div>
              <div v-else class="photo-placeholder">
                <div class="placeholder-icon">
                  <text class="i-mdi-camera text-[#666]"></text>
                </div>
                <div class="placeholder-label">{{ photo.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 车牌号录入 -->
        <div class="section-card">
          <div class="section-head">
            <div class="section-title-wrap">
              <div class="section-dot" />
              <span class="section-title">填写车牌号</span>
              <span class="section-required">必填</span>
            </div>
          </div>

          <div class="plate-input-wrap">
            <car-number-input
              :default-str="orderInfo.plate_number"
              @numberInputResult="onListenNumber"
            />
          </div>
        </div>

        <!-- 车架号照片 -->
        <div class="section-card">
          <div class="section-head">
            <div class="section-title-wrap">
              <div class="section-dot" />
              <span class="section-title">上传车架号特写照片</span>
              <span class="section-required">必填</span>
            </div>
            <span class="section-desc">拍摄车架号（VIN）铭牌特写，需清晰可见</span>
          </div>

          <div class="vin-upload-area" @tap="onClickImage('frame_photo', 0, 'after')">
            <div v-if="orderReqData.frame_photo" class="vin-placeholder">
              <image
                class="vin-preview-img"
                mode="aspectFill"
                :src="getAfterUrl('frame_photo', 0)"
              />
            </div>
            <div v-else class="vin-placeholder">
              <div class="vin-placeholder-icon">
                <text class="i-mdi-camera text-[#666]"></text>
              </div>
              <div class="vin-placeholder-main">点击拍摄车架号</div>
              <div class="vin-placeholder-sub">支持相册选取</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部提交 -->
      <div class="submit-bar">
        <nut-button
          block
          size="large"
          type="primary"
          :disabled="loading"
          :loading="loading"
          @tap="onSubmit"
        >
          {{ loading ? '信息提交中...' : '确认提交' }}
        </nut-button>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import { completeWorkRes, getOrderInfoRes, startWorkRes } from '@/api'
import { useAppStore } from '@/stores/app'
import test from '@/utils/test'
import { toast } from '@/utils/uni'
import { debounce } from 'es-toolkit'

type CarPhotoKey = keyof OrderCarPhoto
interface RawCarPhoto {
  label: string
  key: CarPhotoKey
  index: number
}
type ActionType = 'before' | 'after'

const baseUrl = import.meta.env.VITE_BASE_API,
  uploadUrl = `${baseUrl}/api/common/upload`,
  rawCarPhotos: RawCarPhoto[] = [
    {
      label: '车辆前',
      key: 'front_photos',
      index: 0,
    },
    {
      label: '车辆侧面1',
      key: 'side_photos',
      index: 0,
    },
    {
      label: '车辆侧面2',
      key: 'side_photos',
      index: 1,
    },
    {
      label: '车辆后',
      key: 'back_photos',
      index: 0,
    },
  ]

const appStore = useAppStore()
const { appToken } = storeToRefs(appStore)
const orderInfo = ref<IOrderItem>({} as IOrderItem),
  orderReqData = ref<OrderReqData>({} as OrderReqData),
  loading = ref(false),
  sidePhotos = ref<string[]>([]),
  actionType = ref<ActionType>('before')

const beforeCarPhotos = computed(() =>
  rawCarPhotos.map((photo) => ({
    ...photo,
    url: getBeforeUrl(photo.key, photo.index),
    type: 'before',
  })),
)

const afterCarPhotos = computed(() =>
  rawCarPhotos.map((photo) => ({
    ...photo,
    url: getAfterUrl(photo.key, photo.index),
    type: 'after',
  })),
)

onLoad(async ({ id = 8, type = 'before' }: { id?: string | number; type?: ActionType } = {}) => {
  // type = before 施工前拍照；type = after 施工后拍照
  actionType.value = type
  uni.setNavigationBarTitle({
    title: type == 'before' ? '施工前确认' : '施工后确认',
  })
  if (id) {
    const data = await getOrderInfoRes(id)
    orderInfo.value = data
    if (type == 'before') {
      // 施工前
      orderReqData.value = {
        order_id: orderInfo.value.id,
        front_photos: orderInfo.value.start_front_photos,
        back_photos: orderInfo.value.start_back_photos,
        side_photos: orderInfo.value.start_side_photos.join(),
      }
      sidePhotos.value = orderInfo.value.start_side_photos
    } else {
      // 施工后
      orderReqData.value = {
        order_id: orderInfo.value.id,
        front_photos: orderInfo.value.end_front_photos,
        back_photos: orderInfo.value.end_back_photos,
        side_photos: orderInfo.value.end_side_photos.join(),
        plate_number: orderInfo.value.plate_number,
        frame_photo: orderInfo.value.frame_photo,
      }
      sidePhotos.value = orderInfo.value.end_side_photos
    }
  }
})

function onListenNumber(e: any) {
  orderReqData.value.plate_number = e
}

function getFullUrl(url: string) {
  return `${baseUrl}/${url}`
}

function getBeforeUrl(key: CarPhotoKey, index: number) {
  if (!orderInfo.value.id) return undefined
  if (actionType.value == 'before') {
    const url = key == 'side_photos' ? sidePhotos.value[index] : orderReqData.value[key]
    return url ? (test.url(url) ? url : getFullUrl(url)) : url
  } else {
    const url =
      key == 'side_photos'
        ? orderInfo.value.start_side_photos[index]
        : (orderInfo.value[`start_${key}`] as string)
    return test.url(url) ? url : getFullUrl(url)
  }
}

function getAfterUrl(key: CarPhotoKey, index: number) {
  if (!orderInfo.value.id) return undefined
  const url = key == 'side_photos' ? sidePhotos.value[index] : orderReqData.value[key]
  return url ? (test.url(url) ? url : getFullUrl(url)) : url
}

async function chooseImage(key: CarPhotoKey, index: number) {
  uni.chooseImage({
    count: 1, // 最多拍摄数量
    sourceType: ['camera', 'album'], // 只使用相机
    sizeType: ['compressed'], // 压缩图片
    async success(res) {
      uni.uploadFile({
        url: uploadUrl,
        filePath: res.tempFilePaths[0],
        name: 'file',
        header: {
          token: appToken.value,
          'content-type': 'multipart/form-data',
        },
        async success(result) {
          const {
            code,
            data: { url },
            msg,
          } = JSON.parse(result.data)
          if (code !== 1) {
            toast(msg)
          } else {
            if (key == 'side_photos') {
              sidePhotos.value[index] = url
              orderReqData.value[key] = sidePhotos.value.join()
            } else {
              orderReqData.value[key] = url
            }
          }
        },
        async fail(uploadFileErr) {
          console.log('upload::error', uploadFileErr)
          toast('上传失败！')
        },
      })
    },
    fail(err) {
      console.log('拍照失败:', err)
    },
  })
}

function onClickImage(key: CarPhotoKey, index: number, type: ActionType) {
  if (actionType.value == 'after') {
    // 施工后
    if (type == 'before') {
      let url = ''
      if (key == 'side_photos') {
        url = orderInfo.value.start_side_photos[index]
      } else {
        url = orderInfo.value[`start_${key}`]
      }
      url = test.url(url) ? url : getFullUrl(url)
      uni.previewImage({
        current: index,
        urls: [url],
      })
    } else {
      next(key, index)
    }
  } else {
    next(key, index)
  }
}

function next(key: CarPhotoKey, index: number) {
  let value
  if (key == 'side_photos') {
    value = sidePhotos.value[index]
  } else {
    value = orderReqData.value[key]
  }
  if (value) {
    const fullUrl = test.url(value) ? value : getFullUrl(value)
    uni.showActionSheet({
      itemList: ['预览照片', '重新拍照'],
      success(res) {
        if (res.tapIndex === 0) {
          uni.previewImage({
            current: index,
            urls: [fullUrl],
          })
        } else {
          chooseImage(key, index)
        }
      },
    })
  } else {
    chooseImage(key, index)
  }
}

const onSubmit = debounce(() => {
  uni.showModal({
    title: '提示',
    content: '确认提交吗？一旦提交不可更改！',
    async success({ confirm }) {
      if (confirm) {
        try {
          loading.value = true
          actionType.value == 'before'
            ? await startWorkRes({
                ...orderReqData.value,
                order_id: orderInfo.value.id,
              })
            : await completeWorkRes({
                ...orderReqData.value,
                order_id: orderInfo.value.id,
              })
          appStore.markNeedRefresh()
          uni.navigateBack()
        } finally {
          loading.value = false
        }
      }
    },
  })
}, 500)
</script>

<style lang="scss" scoped>
.completion-page {
  padding-bottom: 100rpx;
  background: var(--uvt-primary-bg-color);
}

// 页头
.page-header {
  display: flex;
  gap: 24rpx;
  align-items: center;
  padding: 40rpx 32rpx 24rpx;

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88rpx;
    height: 88rpx;
    font-size: 44rpx;
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    border-radius: 24rpx;
  }

  .header-info {
    .header-title {
      margin-bottom: 8rpx;
      font-size: 36rpx;
      font-weight: 700;
      color: #1a1a2e;
    }

    .header-sub {
      font-size: 26rpx;
      color: #6b7280;
    }
  }
}

// 订单信息条
.order-banner {
  display: flex;
  flex-direction: column;
  row-gap: 12rpx;
  padding: 24rpx 32rpx;
  margin: 0 32rpx 24rpx;
  background: linear-gradient(135deg, #1a1a2e, #2d2d4e);
  border-radius: 20rpx;

  .order-item {
    display: flex;
    flex: 1;
    gap: 6rpx;
    align-items: center;
    justify-content: space-between;

    .order-label {
      font-size: 22rpx;
      color: rgb(255 255 255 / 50%);
    }

    .order-value {
      font-size: 26rpx;
      font-weight: 600;
      color: #fff;
    }
  }

  .order-divider {
    width: 1rpx;
    height: 48rpx;
    background: rgb(255 255 255 / 15%);
  }
}

// 通用卡片
.section-card {
  padding: 36rpx;
  margin: 32rpx 24rpx;
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 4rpx 20rpx rgb(0 0 0 / 3%);

  .section-head {
    margin-bottom: 32rpx;

    .section-title-wrap {
      display: flex;
      gap: 12rpx;
      align-items: center;
      margin-bottom: 8rpx;

      .section-dot {
        width: 8rpx;
        height: 36rpx;
        background: #22c55e;
        border-radius: 4rpx;
      }

      .section-title {
        font-size: 32rpx;
        font-weight: 700;
        color: #1a1a2e;
      }

      .section-required {
        padding: 4rpx 12rpx;
        font-size: 20rpx;
        color: #ef4444;
        background: #fef2f2;
        border-radius: 8rpx;
      }
    }

    .section-desc {
      padding-left: 20rpx;
      font-size: 26rpx;
      color: #9ca3af;
    }
  }
}

// 施工过程三张照片
.process-photos {
  display: flex;
  gap: 20rpx;

  .photo-item {
    position: relative;
    flex: 1;

    .photo-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 150rpx;
      background: #f8fafc;
      border: 2rpx dashed #d1d5db;
      border-radius: 20rpx;
      padding: 5rpx;

      .placeholder-icon {
        font-size: 44rpx;
      }

      .placeholder-label {
        font-size: 24rpx;
        color: #9ca3af;
      }

      .preview-img {
        width: 100%;
        height: 100%;
        border-radius: 20rpx;
      }
    }
  }
}

// 参考示例
.example-wrap {
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 20rpx;

  .example-header {
    display: flex;
    gap: 10rpx;
    align-items: center;
    margin-bottom: 20rpx;

    .example-icon {
      font-size: 28rpx;
    }

    .example-title {
      font-size: 26rpx;
      font-weight: 600;
      color: #374151;
    }
  }

  .example-list {
    display: flex;
    gap: 16rpx;

    .example-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;

      .example-img-wrap {
        width: 100%;
        margin-bottom: 4rpx;
        overflow: hidden;
        border-radius: 12rpx;
      }

      .example-mock {
        display: flex;
        flex-direction: column;
        gap: 6rpx;
        align-items: center;
        justify-content: center;
        height: 140rpx;
        border-radius: 12rpx;

        &.before-mock {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        }

        &.during-mock {
          background: linear-gradient(135deg, #ffedd5, #fed7aa);
        }

        &.after-mock {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
        }

        .mock-car {
          font-size: 40rpx;
        }

        .mock-label {
          font-size: 20rpx;
          color: #6b7280;
          text-align: center;
        }
      }

      .example-tag {
        padding: 4rpx 12rpx;
        font-size: 20rpx;
        font-weight: 600;
        border-radius: 20rpx;

        &.before-tag {
          color: #3b82f6;
          background: #dbeafe;
        }

        &.during-tag {
          color: #f97316;
          background: #ffedd5;
        }

        &.after-tag {
          color: #22c55e;
          background: #dcfce7;
        }
      }

      .example-tip {
        font-size: 20rpx;
        color: #9ca3af;
        text-align: center;
      }
    }
  }
}

// 车牌号输入
.plate-input-wrap {
}

.input-tip {
  display: flex;
  gap: 8rpx;
  align-items: center;
  margin-top: 16rpx;

  .tip-icon {
    font-size: 24rpx;
  }

  .tip-text {
    font-size: 24rpx;
    color: #9ca3af;
  }
}

// 车架号上传区
.vin-upload-area {
  overflow: hidden;
  border-radius: 20rpx;

  .vin-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 240rpx;
    background: #f8fafc;
    border: 2rpx dashed #d1d5db;
    border-radius: 20rpx;
    padding: 10rpx;

    .vin-placeholder-icon {
      font-size: 50rpx;
    }

    .vin-placeholder-main {
      margin-bottom: 8rpx;
      font-size: 30rpx;
      font-weight: 600;
      color: #374151;
    }

    .vin-placeholder-sub {
      font-size: 24rpx;
      color: #9ca3af;
    }

    .vin-preview-img {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
  }
}

// VIN 示例说明
.vin-example {
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 20rpx;

  .vin-example-header {
    display: flex;
    gap: 10rpx;
    align-items: center;
    margin-bottom: 20rpx;

    .example-icon {
      font-size: 28rpx;
    }

    .example-title {
      font-size: 26rpx;
      font-weight: 600;
      color: #374151;
    }
  }

  .vin-locations {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 20rpx;

    .vin-location-item {
      display: flex;
      gap: 16rpx;
      align-items: center;

      .location-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 72rpx;
        height: 72rpx;
        font-size: 36rpx;
        background: #fff;
        border-radius: 16rpx;
        box-shadow: 0 2rpx 8rpx rgb(0 0 0 / 5%);
        flex-shrink: 0;
      }

      .location-info {
        .location-name {
          margin-bottom: 4rpx;
          font-size: 28rpx;
          font-weight: 600;
          color: #1a1a2e;
        }

        .location-desc {
          font-size: 24rpx;
          color: #6b7280;
        }
      }
    }
  }

  .vin-format-tip {
    display: flex;
    gap: 10rpx;
    align-items: center;
    padding: 16rpx 20rpx;
    background: #fff;
    border-left: 6rpx solid #22c55e;
    border-radius: 0 12rpx 12rpx 0;

    .format-icon {
      font-size: 26rpx;
      flex-shrink: 0;
    }

    .format-text {
      font-size: 24rpx;
      color: #374151;
      line-height: 1.5;
    }
  }
}

// 底部提交栏
.submit-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 2rpx solid #f0f2f5;
  box-shadow: 0 -8rpx 32rpx rgb(0 0 0 / 6%);
}
</style>
