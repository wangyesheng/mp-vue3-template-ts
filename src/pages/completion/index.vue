<template>
  <AppContainer>
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

      <!-- 订单信息条 -->
      <div class="order-banner">
        <div class="order-item">
          <span class="order-label">订单号</span>
          <span class="order-value">#36124301</span>
        </div>
        <div class="order-divider" />
        <div class="order-item">
          <span class="order-label">车辆</span>
          <span class="order-value">奔驰 E300</span>
        </div>
        <div class="order-divider" />
        <div class="order-item">
          <span class="order-label">服务</span>
          <span class="order-value">全车精洗 + 镀晶</span>
        </div>
      </div>

      <!-- 施工过程照片 -->
      <div class="section-card">
        <div class="section-head">
          <div class="section-title-wrap">
            <div class="section-dot" />
            <span class="section-title">施工过程照片</span>
            <span class="section-required">必填</span>
          </div>
          <span class="section-desc">需上传车辆前、中、后各 1 张</span>
        </div>

        <div class="process-photos">
          <!-- 施工前 -->
          <div class="photo-item" @tap="choosePhoto('before')">
            <div v-if="photos.before" class="photo-preview">
              <image class="preview-img" :src="photos.before" mode="aspectFill" />
              <div class="photo-delete" @tap.stop="removePhoto('before')">
                <text class="delete-icon">✕</text>
              </div>
            </div>
            <div v-else class="photo-placeholder">
              <div class="placeholder-icon">
                <text>📷</text>
              </div>
              <div class="placeholder-label">车辆前</div>
            </div>
            <div class="photo-stage before">
              <text>前</text>
            </div>
          </div>

          <!-- 施工中 -->
          <div class="photo-item" @tap="choosePhoto('during')">
            <div v-if="photos.during" class="photo-preview">
              <image class="preview-img" :src="photos.during" mode="aspectFill" />
              <div class="photo-delete" @tap.stop="removePhoto('during')">
                <text class="delete-icon">✕</text>
              </div>
            </div>
            <div v-else class="photo-placeholder">
              <div class="placeholder-icon">
                <text>📷</text>
              </div>
              <div class="placeholder-label">车辆中</div>
            </div>
            <div class="photo-stage during">
              <text>中</text>
            </div>
          </div>

          <!-- 施工后 -->
          <div class="photo-item" @tap="choosePhoto('after')">
            <div v-if="photos.after" class="photo-preview">
              <image class="preview-img" :src="photos.after" mode="aspectFill" />
              <div class="photo-delete" @tap.stop="removePhoto('after')">
                <text class="delete-icon">✕</text>
              </div>
            </div>
            <div v-else class="photo-placeholder">
              <div class="placeholder-icon">
                <text>📷</text>
              </div>
              <div class="placeholder-label">车辆后</div>
            </div>
            <div class="photo-stage after">
              <text>后</text>
            </div>
          </div>
        </div>

        <!-- 参考示例 -->
        <div class="example-wrap">
          <div class="example-header">
            <text class="example-icon">💡</text>
            <span class="example-title">拍摄参考示例</span>
          </div>
          <div class="example-list">
            <div class="example-item">
              <div class="example-img-wrap">
                <div class="example-mock before-mock">
                  <div class="mock-car">🚗</div>
                  <div class="mock-label">车辆整体正面</div>
                </div>
              </div>
              <span class="example-tag before-tag">施工前</span>
              <span class="example-tip">全车正面，光线充足</span>
            </div>
            <div class="example-item">
              <div class="example-img-wrap">
                <div class="example-mock during-mock">
                  <div class="mock-car">🔧</div>
                  <div class="mock-label">施工操作特写</div>
                </div>
              </div>
              <span class="example-tag during-tag">施工中</span>
              <span class="example-tip">操作部位特写</span>
            </div>
            <div class="example-item">
              <div class="example-img-wrap">
                <div class="example-mock after-mock">
                  <div class="mock-car">✨</div>
                  <div class="mock-label">完工整体效果</div>
                </div>
              </div>
              <span class="example-tag after-tag">施工后</span>
              <span class="example-tip">整体效果对比</span>
            </div>
          </div>
        </div>
      </div>

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
            :maxlength="6"
            placeholder-class="plate-placeholder"
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

        <div class="vin-upload-area" @tap="choosePhoto('vin')">
          <div v-if="photos.vin" class="vin-preview">
            <image class="vin-preview-img" :src="photos.vin" mode="aspectFill" />
            <div class="vin-delete" @tap.stop="removePhoto('vin')">
              <text class="delete-icon">✕</text>
            </div>
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

        <!-- VIN 示例 -->
        <div class="vin-example">
          <div class="vin-example-header">
            <text class="example-icon">💡</text>
            <span class="example-title">车架号位置示例</span>
          </div>
          <div class="vin-locations">
            <div class="vin-location-item">
              <div class="location-icon-wrap">
                <text class="location-icon">🪟</text>
              </div>
              <div class="location-info">
                <div class="location-name">前挡风玻璃下方</div>
                <div class="location-desc">仪表盘左侧可见，最常见位置</div>
              </div>
            </div>
            <div class="vin-location-item">
              <div class="location-icon-wrap">
                <text class="location-icon">🚪</text>
              </div>
              <div class="location-info">
                <div class="location-name">驾驶座车门铰链处</div>
                <div class="location-desc">打开车门，门框内侧铭牌</div>
              </div>
            </div>
          </div>
          <div class="vin-format-tip">
            <text class="format-icon">🔍</text>
            <span class="format-text">VIN 共 17 位，含字母与数字，如：WBAU51090AB012345</span>
          </div>
        </div>
      </div>

      <!-- 底部提交 -->
      <div class="submit-bar">
        <div class="submit-progress">
          <div class="progress-item" :class="{ done: photos.before }">
            <text>{{ photos.before ? '✓' : '1' }}</text>
          </div>
          <div class="progress-line" :class="{ done: photos.before && photos.during }" />
          <div class="progress-item" :class="{ done: photos.during }">
            <text>{{ photos.during ? '✓' : '2' }}</text>
          </div>
          <div class="progress-line" :class="{ done: photos.during && photos.after }" />
          <div class="progress-item" :class="{ done: photos.after }">
            <text>{{ photos.after ? '✓' : '3' }}</text>
          </div>
          <div class="progress-line" :class="{ done: photos.after && plateNumber }" />
          <div class="progress-item" :class="{ done: plateNumber }">
            <text>{{ plateNumber ? '✓' : '4' }}</text>
          </div>
          <div class="progress-line" :class="{ done: plateNumber && photos.vin }" />
          <div class="progress-item" :class="{ done: photos.vin }">
            <text>{{ photos.vin ? '✓' : '5' }}</text>
          </div>
        </div>
        <div class="progress-hint">已完成 {{ doneCount }}/5 项</div>
        <nut-button
          block
          size="large"
          :custom-color="isAllDone ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#d1d5db'"
          :disabled="!isAllDone"
          @tap="handleSubmit"
        >
          <span class="submit-btn-text">{{
            isAllDone ? '确认完工并提交' : '请完成所有必填项'
          }}</span>
        </nut-button>
      </div>
    </div>
  </AppContainer>
</template>

<script setup lang="ts">
type PhotoKey = 'before' | 'during' | 'after' | 'vin'

const photos = reactive<Record<PhotoKey, string>>({
  before: '',
  during: '',
  after: '',
  vin: '',
})

const plateNumber = ref('')

const doneCount = computed(() => {
  let count = 0
  if (photos.before) count++
  if (photos.during) count++
  if (photos.after) count++
  if (plateNumber.value) count++
  if (photos.vin) count++
  return count
})

const isAllDone = computed(() => doneCount.value === 5)

function choosePhoto(key: PhotoKey) {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success(res) {
      photos[key] = res.tempFilePaths[0]
    },
  })
}

function removePhoto(key: PhotoKey) {
  photos[key] = ''
}

function handleSubmit() {
  uni.showToast({ title: '提交成功，等待结算', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.completion-page {
  padding-bottom: 240rpx;
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
  align-items: center;
  padding: 24rpx 32rpx;
  margin: 0 32rpx 24rpx;
  background: linear-gradient(135deg, #1a1a2e, #2d2d4e);
  border-radius: 20rpx;

  .order-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6rpx;
    align-items: center;

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
  padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #f0f2f5;
  box-shadow: 0 -8rpx 32rpx rgb(0 0 0 / 6%);

  .submit-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12rpx;

    .progress-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44rpx;
      height: 44rpx;
      font-size: 22rpx;
      font-weight: 600;
      color: #9ca3af;
      background: #f0f2f5;
      border-radius: 50%;
      transition: all 0.3s;

      &.done {
        color: #fff;
        background: #22c55e;
      }
    }

    .progress-line {
      flex: 1;
      height: 4rpx;
      max-width: 60rpx;
      background: #f0f2f5;
      transition: all 0.3s;

      &.done {
        background: #22c55e;
      }
    }
  }

  .progress-hint {
    margin-bottom: 16rpx;
    font-size: 24rpx;
    color: #9ca3af;
    text-align: center;
  }

  .submit-btn-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }
}

// 占位符样式
.plate-placeholder {
  color: #d1d5db !important;
}
</style>
