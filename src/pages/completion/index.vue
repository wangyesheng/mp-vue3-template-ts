<template>
  <app-container>
    <div class="completion-page">
      <!-- 顶部进度提示 -->
      <div class="page-header">
        <div class="header-icon">
          <text>🔧</text>
        </div>
        <div class="header-info">
          <div class="header-title">施工完成确认</div>
          <div class="header-sub">请上传施工相关照片以完成结算</div>
        </div>
      </div>

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
            <span class="font-mono text-sm font-medium text-slate-700">{{
              orderInfo.order_sn
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">车辆</span>
            <span class="text-sm font-medium text-slate-700">{{ orderInfo.vehicle_type }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-400">服务</span>
            <span class="text-sm font-medium text-emerald-700">
              {{ orderInfo.product_name }} - {{ orderInfo.service_name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 施工前照片 -->
      <div class="section-card">
        <div class="section-head">
          <div class="section-title-wrap">
            <div class="section-dot" />
            <span class="section-title">施工前照片</span>
            <span class="section-required">必填</span>
          </div>
          <span class="section-desc">车辆前1张、车辆侧面2张、车辆后1张</span>
        </div>

        <div class="process-photos">
          <!-- 施工前 -->
          <div
            v-for="{ label, key, index } in rawCarPhotos"
            :key="key"
            class="photo-item"
            @tap="onClickImage(key, index)"
          >
            <div
              v-if="key == 'side_photos' ? sidePhotos[index] : orderReqData[key]"
              class="photo-preview"
            >
              <image class="preview-img" mode="aspectFill" :src="getUrl(key, index)" />
            </div>
            <div v-else class="photo-placeholder">
              <div class="placeholder-icon">
                <text class="i-mdi-camera text-[#666]"></text>
              </div>
              <div class="placeholder-label">{{ label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 施工后照片 -->
      <!-- <div class="section-card">
        <div class="section-head">
          <div class="section-title-wrap">
            <div class="section-dot" />
            <span class="section-title">施工后照片</span>
            <span class="section-required">必填</span>
          </div>
          <span class="section-desc">车辆前1张、车辆侧面2张、车辆后1张</span>
        </div>

        <div class="process-photos">
          <div
            v-for="{ label, key, index } in rawCarPhotos"
            :key="key + index"
            class="photo-item"
            @tap="onClickImage(key, index)"
          >
            <div v-if="sidePhotos[index]" class="photo-preview">
              <image class="preview-img" mode="aspectFill" :src="getUrl(key, index)" />
            </div>
            <div v-else class="photo-placeholder">
              <div class="placeholder-icon">
                <text class="i-mdi-camera text-[#666]"></text>
              </div>
              <div class="placeholder-label">{{ label }}</div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- 车牌号录入 -->
      <div class="section-card">
        <div class="section-head">
          <div class="section-title-wrap">
            <div class="section-dot" />
            <span class="section-title">车牌号</span>
            <span class="section-required">必填</span>
          </div>
          <span class="section-desc">请输入完整车牌号码</span>
        </div>

        <div class="plate-input-wrap">
          <div class="plate-prefix">
            <text>粤</text>
          </div>
          <div class="plate-divider" />
          <input
            v-model="plateNumber"
            class="plate-input"
            type="text"
            placeholder="A12345"
            placeholder-class="plate-placeholder"
            :maxlength="6"
          />
          <div v-if="plateNumber" class="plate-clear" @tap="plateNumber = ''">
            <text class="clear-icon">✕</text>
          </div>
        </div>

        <!-- 示例提示 -->
        <div class="input-tip">
          <text class="tip-icon">ℹ️</text>
          <span class="tip-text">示例：粤A12345 · 新能源：粤AD12345</span>
        </div>
      </div>

      <!-- 车架号照片 -->
      <div class="section-card">
        <div class="section-head">
          <div class="section-title-wrap">
            <div class="section-dot" />
            <span class="section-title">车架号特写照片</span>
            <span class="section-required">必填</span>
          </div>
          <span class="section-desc">拍摄车架号（VIN）铭牌特写，需清晰可见</span>
        </div>

        <div class="vin-upload-area" @tap="onClickImage('frame_photo', 0)">
          <div v-if="orderReqData.frame_photo" class="vin-preview">
            <image class="vin-preview-img" mode="aspectFill" :src="orderReqData.frame_photo" />
            <div class="vin-overlay">
              <text class="vin-overlay-icon">✓</text>
              <span>重新拍摄</span>
            </div>
          </div>
          <div v-else class="vin-placeholder">
            <div class="vin-placeholder-icon">
              <text>📸</text>
            </div>
            <div class="vin-placeholder-main">点击拍摄车架号</div>
            <div class="vin-placeholder-sub">支持相册选取</div>
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
import { getOrderInfoRes, startWorkRes } from '@/api'
import { useAppStore } from '@/stores/app'
import test from '@/utils/test'
import { toast } from '@/utils/uni'
import { debounce } from 'lodash-es'

type CarPhotoKey = keyof OrderCarPhoto
interface RawCarPhoto {
  label: string
  key: CarPhotoKey
  index: number
}

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

const { appToken } = storeToRefs(useAppStore())
const orderInfo = ref<IOrderItem>({} as IOrderItem),
  orderReqData = ref<OrderReqData>({} as OrderReqData),
  loading = ref(false),
  sidePhotos = ref<string[]>([])

onLoad(async ({ id = 8 }: { id?: string | number } = {}) => {
  if (!id) return
  orderInfo.value = await getOrderInfoRes(id)
  orderReqData.value = {
    order_id: orderInfo.value.id,
    front_photos: orderInfo.value.start_front_photos,
    back_photos: orderInfo.value.start_back_photos,
    side_photos: orderInfo.value.start_side_photos.join(),
  }
  sidePhotos.value = orderInfo.value.start_side_photos
  console.log(orderReqData.value, sidePhotos.value)
})

function getFullUrl(url: string) {
  return `${baseUrl}/${url}`
}

function getUrl(key: CarPhotoKey, index: number) {
  if (key == 'side_photos') {
    return test.url(sidePhotos.value[index])
      ? sidePhotos.value[index]
      : getFullUrl(sidePhotos.value[index])
  } else {
    return test.url(orderReqData.value[key]!)
      ? orderReqData.value[key]
      : getFullUrl(orderReqData.value[key]!)
  }
}

async function onChooseImage(key: CarPhotoKey, index: number) {
  uni.chooseImage({
    count: 1, // 最多拍摄数量
    sourceType: ['camera'], // 只使用相机
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

function onClickImage(key: CarPhotoKey, index: number) {
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
            current: fullUrl,
            urls: [fullUrl],
          })
        } else {
          onChooseImage(key, index)
        }
      },
    })
  } else {
    onChooseImage(key, index)
  }
}

const plateNumber = ref('')

const onSubmit = debounce(async () => {
  try {
    loading.value = true
    await startWorkRes({
      ...orderReqData.value,
      side_photos: sidePhotos.value.join(),
      order_id: orderInfo.value.id,
    })
  } finally {
    loading.value = false
  }
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
  margin: 0 32rpx 24rpx;
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
  margin-bottom: 32rpx;

  .photo-item {
    position: relative;
    flex: 1;

    .photo-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200rpx;
      background: #f8fafc;
      border: 2rpx dashed #d1d5db;
      border-radius: 20rpx;

      .placeholder-icon {
        margin-bottom: 12rpx;
        font-size: 44rpx;
      }

      .placeholder-label {
        font-size: 24rpx;
        color: #9ca3af;
      }
    }

    .photo-preview {
      position: relative;
      height: 200rpx;
      overflow: hidden;
      border-radius: 20rpx;

      .preview-img {
        width: 100%;
        height: 100%;
      }

      .photo-delete {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44rpx;
        height: 44rpx;
        background: rgb(0 0 0 / 50%);
        border-radius: 50%;

        .delete-icon {
          font-size: 20rpx;
          color: #fff;
        }
      }
    }

    .photo-stage {
      position: absolute;
      bottom: 12rpx;
      left: 50%;
      padding: 4rpx 14rpx;
      font-size: 22rpx;
      font-weight: 600;
      border-radius: 20rpx;
      transform: translateX(-50%);

      &.before {
        color: #3b82f6;
        background: rgb(59 130 246 / 15%);
      }

      &.during {
        color: #f97316;
        background: rgb(249 115 22 / 15%);
      }

      &.after {
        color: #22c55e;
        background: rgb(34 197 94 / 15%);
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
  display: flex;
  align-items: center;
  height: 96rpx;
  overflow: hidden;
  background: #f8fafc;
  border: 2rpx solid #e5e7eb;
  border-radius: 20rpx;

  &:focus-within {
    border-color: #22c55e;
    box-shadow: 0 0 0 4rpx rgb(34 197 94 / 10%);
  }

  .plate-prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96rpx;
    height: 100%;
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a2e;
    background: #eef2ff;
    border-right: 2rpx solid #e5e7eb;
    letter-spacing: 2rpx;
  }

  .plate-divider {
    display: none;
  }

  .plate-input {
    flex: 1;
    height: 100%;
    padding: 0 24rpx;
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: 8rpx;
    background: transparent;
  }

  .plate-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 64rpx;
    margin-right: 16rpx;
    background: #e5e7eb;
    border-radius: 50%;

    .clear-icon {
      font-size: 22rpx;
      color: #9ca3af;
    }
  }
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
  margin-bottom: 28rpx;
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

    .vin-placeholder-icon {
      margin-bottom: 16rpx;
      font-size: 64rpx;
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
  }

  .vin-preview {
    position: relative;
    height: 240rpx;

    .vin-preview-img {
      width: 100%;
      height: 100%;
    }

    .vin-delete {
      position: absolute;
      top: 12rpx;
      right: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52rpx;
      height: 52rpx;
      background: rgb(0 0 0 / 50%);
      border-radius: 50%;

      .delete-icon {
        font-size: 22rpx;
        color: #fff;
      }
    }

    .vin-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      gap: 8rpx;
      align-items: center;
      justify-content: center;
      height: 64rpx;
      font-size: 26rpx;
      color: #fff;
      background: linear-gradient(transparent, rgb(0 0 0 / 60%));

      .vin-overlay-icon {
        font-size: 28rpx;
        color: #22c55e;
      }
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
  z-index: 999;
  padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 2rpx solid #f0f2f5;
  box-shadow: 0 -8rpx 32rpx rgb(0 0 0 / 6%);
}

// 占位符样式
.plate-placeholder {
  color: #d1d5db !important;
}
</style>
