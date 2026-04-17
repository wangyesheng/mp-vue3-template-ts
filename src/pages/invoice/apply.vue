<template>
  <app-container>
    <div class="invoice-popup">
      <!-- 开票金额 -->
      <div class="popup-amount-card">
        <div>
          <div class="amount-label">本次需开票金额</div>
          <div class="amount-value">
            <span class="amount-symbol">¥</span>
            <span class="amount-num">{{ invoiceInfo.total_price }}</span>
          </div>
          <div class="amount-sub">共 {{ invoiceInfo.total_number }} 笔订单</div>
        </div>
        <image src="@/static/images/invoice.png"></image>
      </div>

      <!-- 我方开票信息 -->
      <div class="popup-section">
        <div class="popup-section-title justify-between">
          <span> 我方开票信息 </span>
          <span
            class="text-xs font-normal text-[var(--uvt-primary-color)]"
            @click="onCopyBillingInfo"
          >
            点击复制
          </span>
        </div>
        <div class="info-card">
          <div v-for="(item, index) in invoiceInfo.invoice_info" :key="index" class="info-row">
            <span class="info-label">{{ item.label }}</span>
            <span class="info-value">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <!-- 回填发票信息 -->
      <div class="popup-section">
        <div class="popup-section-title">
          回填发票凭证
          <span class="optional-tag">开完票后填写</span>
        </div>

        <!-- 发票号码 -->
        <div class="input-wrap">
          <div class="input-label">发票号码</div>
          <input
            v-model="invoiceReqData.invoice_number"
            class="invoice-input"
            type="text"
            placeholder="请输入发票号码"
            placeholder-class="input-placeholder"
          />
        </div>

        <!-- 上传发票截图 -->
        <div class="upload-wrap">
          <div class="input-label">发票截图</div>
          <div class="upload-area" @tap="uploadInvoicePhoto">
            <div v-if="invoiceReqData.invoice_file" class="upload-preview">
              <image class="preview-img" mode="aspectFill" :src="invoiceReqData._invoice_file" />
            </div>
            <div v-else class="upload-placeholder">
              <text class="upload-icon i-mdi-camera text-[#666]"></text>
              <span class="upload-text">上传发票截图</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="invoice-bar">
        <nut-button
          block
          size="large"
          type="primary"
          custom-color="linear-gradient(135deg, #22c55e, #16a34a)"
          :loading="loading"
          :disabled="loading"
          @click="onSubmit"
        >
          {{ loading ? '提交中...' : '确认提交' }}
        </nut-button>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import { applyInvoiceRes, getInvoiceDetailRes } from '@/api'
import { useUploader } from '@/hooks/useUploader'
import { useAppStore } from '@/stores/app'
import { copy } from '@/utils/uni'
import { debounce } from 'es-toolkit'

const { upload } = useUploader()
const appStore = useAppStore()

const invoiceInfo = ref<Partial<IInvoiceApplyInfo>>({})
const invoiceReqData = ref({
    order_ids: '',
    invoice_number: '',
    invoice_file: '',
    _invoice_file: '',
  }),
  loading = ref(false)

const onSubmit = debounce(async () => {
  try {
    loading.value = true
    await applyInvoiceRes(invoiceReqData.value)
    appStore.markNeedRefresh()
    uni.navigateBack()
  } finally {
    loading.value = false
  }
}, 500)

function uploadInvoicePhoto() {
  if (invoiceReqData.value.invoice_file) {
    uni.showActionSheet({
      itemList: ['预览照片', '重新拍照'],
      success(res) {
        if (res.tapIndex === 0) {
          uni.previewImage({
            current: 0,
            urls: [invoiceReqData.value._invoice_file],
          })
        } else {
          chooseImage()
        }
      },
    })
  } else {
    chooseImage()
  }
}

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    async success(res) {
      const { fullUrl, url } = await upload(res.tempFilePaths[0])
      invoiceReqData.value.invoice_file = url
      invoiceReqData.value._invoice_file = fullUrl
    },
  })
}

function onCopyBillingInfo() {
  const data = invoiceInfo.value.invoice_info?.reduce((memo, current) => {
    memo += `${current.label}：${current.value}\n`
    return memo
  }, '') as string

  copy(data, '开票信息复制成功！')
}

onLoad(async ({ ids }: { ids?: string } = {}) => {
  invoiceReqData.value.order_ids = ids!
  const data = await getInvoiceDetailRes(ids!)
  invoiceInfo.value = data
})
</script>

<style lang="scss" scoped>
// 开票弹窗
.invoice-popup {
  padding: 32rpx 32rpx 150rpx;
  display: flex;
  flex-direction: column;
  row-gap: 30rpx;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid #f0f2f5;

    .popup-title {
      font-size: 36rpx;
      font-weight: 700;
      color: #1a1a2e;
    }

    .popup-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56rpx;
      height: 56rpx;
      font-size: 28rpx;
      color: #9ca3af;
      background: #f5f6fa;
      border-radius: 50%;
    }
  }

  // 金额卡片
  .popup-amount-card {
    text-align: center;
    background: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #1a1a2e;

    image {
      width: 85.33rpx;
      height: 85.33rpx;
    }

    .amount-label {
      margin-bottom: 12rpx;
      font-size: 26rpx;
    }

    .amount-value {
      display: flex;
      gap: 8rpx;
      align-items: baseline;
      justify-content: center;
      margin-bottom: 8rpx;

      .amount-symbol {
        font-size: 32rpx;
        font-weight: 600;
      }

      .amount-num {
        font-size: 64rpx;
        font-weight: 700;
        line-height: 1;
      }
    }

    .amount-sub {
      font-size: 24rpx;
    }
  }

  .popup-section {
    .popup-section-title {
      display: flex;
      gap: 10rpx;
      align-items: center;
      margin-bottom: 20rpx;
      font-size: 30rpx;
      font-weight: 700;
      color: #1a1a2e;

      .section-icon {
        font-size: 30rpx;
      }

      .optional-tag {
        padding: 4rpx 12rpx;
        margin-left: 8rpx;
        font-size: 22rpx;
        font-weight: 400;
        color: #9ca3af;
        background: #f0f2f5;
        border-radius: 8rpx;
      }
    }

    .info-card {
      padding: 12rpx 6rpx;
      background: #fff;
      border-radius: 16rpx;
      overflow: hidden;

      .info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 24rpx;
        border-bottom: 1rpx solid #f0f2f5;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 26rpx;
          color: #9ca3af;
          flex-shrink: 0;
          margin-right: 20rpx;
        }

        .info-value {
          font-size: 26rpx;
          font-weight: 500;
          color: #374151;
          text-align: right;

          &.mono {
            font-family: monospace;
            letter-spacing: 2rpx;
          }
        }
      }
    }

    .copy-tip {
      display: flex;
      gap: 8rpx;
      align-items: center;
      justify-content: center;
      padding: 16rpx;
      margin-top: 16rpx;
      font-size: 26rpx;
      color: #22c55e;
      background: #f0fdf4;
      border-radius: 12rpx;

      .tip-icon {
        font-size: 26rpx;
      }
    }

    .input-label {
      margin-bottom: 12rpx;
      font-size: 26rpx;
      color: #9ca3af;
    }

    // 输入框
    .input-wrap {
      padding: 0 24rpx;
      margin-bottom: 24rpx;

      .invoice-input {
        width: 100%;
        height: 88rpx;
        padding: 0 24rpx;
        font-size: 28rpx;
        color: #1a1a2e;
        background: #f8fafc;
        border: 2rpx solid #e5e7eb;
        border-radius: 16rpx;
        box-sizing: border-box;

        &:focus {
          border-color: #22c55e;
        }
      }
    }

    // 上传区
    .upload-wrap {
      padding: 0 24rpx;
      .upload-area {
        overflow: hidden;
        border-radius: 16rpx;
        height: 180rpx;
        background: #f8fafc;
        border: 2rpx dashed #d1d5db;
        border-radius: 16rpx;
        padding: 10rpx 20rpx;

        .upload-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          row-gap: 12rpx;
          align-items: center;
          justify-content: center;

          .upload-icon {
            font-size: 42rpx;
          }

          .upload-text {
            font-size: 26rpx;
            color: #999;
          }
        }

        .upload-preview {
          height: 100%;

          .preview-img {
            width: 100%;
            height: 100%;
            border-radius: 16rpx;
          }
        }
      }
    }
  }

  .invoice-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1rpx solid #f0f2f5;
    box-shadow: 0 -8rpx 32rpx rgb(0 0 0 / 6%);
  }
}
</style>
