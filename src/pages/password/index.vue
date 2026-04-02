<template>
  <app-container>
    <view class="password-page">
      <view class="content">
        <view class="header">
          <text class="title">修改密码</text>
          <text class="desc">请输入您的手机号和密码信息</text>
        </view>

        <view class="form">
          <view class="form-item">
            <view class="form-item__prefix">
              <text class="i-mdi-phone text-[42rpx] text-[#333]"></text>
            </view>
            <nut-input
              v-model="form.mobile"
              type="number"
              class="form-item__input"
              placeholder="请输入手机号"
              placeholder-class="input-placeholder"
              :cursor-spacing="20"
              :maxlength="11"
            />
          </view>

          <view class="form-item">
            <view class="form-item__prefix">
              <text class="i-mdi-lock-outline text-[42rpx] text-[#333]"></text>
            </view>
            <nut-input
              v-model="form.oldPassword"
              class="form-item__input"
              placeholder="请输入旧密码"
              placeholder-class="input-placeholder"
              :cursor-spacing="20"
              :password="!showOldPassword"
              :maxlength="20"
            />
            <view class="form-item__suffix" @click="showOldPassword = !showOldPassword">
              <nut-icon custom-color="#333" :name="showOldPassword ? 'marshalling' : 'eye'" />
            </view>
          </view>

          <view class="form-item">
            <view class="form-item__prefix">
              <text class="i-mdi-lock text-[42rpx] text-[#333]"></text>
            </view>
            <nut-input
              v-model="form.newPassword"
              class="form-item__input"
              placeholder="请输入新密码"
              placeholder-class="input-placeholder"
              :cursor-spacing="20"
              :password="!showNewPassword"
              :maxlength="20"
            />
            <view class="form-item__suffix" @click="showNewPassword = !showNewPassword">
              <nut-icon custom-color="#333" :name="showNewPassword ? 'marshalling' : 'eye'" />
            </view>
          </view>

          <view class="form-item">
            <view class="form-item__prefix">
              <text class="i-mdi-lock-check text-[42rpx] text-[#333]"></text>
            </view>
            <nut-input
              v-model="form.confirmPassword"
              class="form-item__input"
              placeholder="请确认新密码"
              placeholder-class="input-placeholder"
              :cursor-spacing="20"
              :password="!showConfirmPassword"
              :maxlength="20"
            />
            <view class="form-item__suffix" @click="showConfirmPassword = !showConfirmPassword">
              <nut-icon custom-color="#333" :name="showConfirmPassword ? 'marshalling' : 'eye'" />
            </view>
          </view>

          <nut-button
            block
            type="primary"
            size="large"
            custom-color="linear-gradient(135deg, #2bf073, #22c55e)"
            :loading="loading"
            :disabled="loading"
            @click="handleSubmit"
          >
            {{ loading ? '提交中...' : '确认修改' }}
          </nut-button>
        </view>
      </view>
    </view>
  </app-container>
</template>

<script setup lang="ts">
import { debounce } from 'es-toolkit'
import { useAppStore } from '@/stores/app'
import test from '@/utils/test'

const appStore = useAppStore()

const form = ref({
  mobile: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

function validateForm() {
  if (!form.value.mobile) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return false
  }
  if (test.mobile(form.value.mobile)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return false
  }
  if (!form.value.oldPassword) {
    uni.showToast({ title: '请输入旧密码', icon: 'none' })
    return false
  }
  if (!form.value.newPassword) {
    uni.showToast({ title: '请输入新密码', icon: 'none' })
    return false
  }
  if (form.value.newPassword.length < 6) {
    uni.showToast({ title: '新密码至少6位', icon: 'none' })
    return false
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return false
  }
  return true
}

const handleSubmit = debounce(async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
    uni.showToast({ title: '修改成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } finally {
    loading.value = false
  }
}, 500)

onLoad(() => {
  if (appStore.appUser?.mobile) {
    form.value.mobile = appStore.appUser.mobile
  }
})
</script>

<style lang="scss" scoped>
.password-page {
  flex: 1;
  display: flex;
  flex-direction: column;

  .content {
    padding: 60rpx 80rpx;

    .header {
      margin-bottom: 60rpx;

      .title {
        display: block;
        margin-bottom: 16rpx;
        font-size: 48rpx;
        font-weight: 700;
        color: #1a1a2e;
      }

      .desc {
        font-size: 28rpx;
        color: #9ca3af;
      }
    }

    .form {
      width: 100%;

      :deep() {
        button {
          margin-top: 40rpx;
          box-shadow: 0 16rpx 48rpx rgba(34, 197, 94, 0.3);
          font-size: 32rpx;
          font-weight: 550;
        }
      }

      .form-item {
        display: flex;
        align-items: center;
        height: 104rpx;
        padding: 0 32rpx;
        margin-bottom: 32rpx;
        background: #fff;
        border-radius: 20rpx;
        box-shadow: 0 4rpx 24rpx rgb(0 0 0 / 5%);

        :deep() {
          .nut-input {
            height: 100% !important;
            padding: 0 !important;
          }
          .nut-input--border {
            border: none !important;
          }

          .nut-input__value {
            font-size: 30rpx;
            color: #1a1a2e;
          }

          .input-placeholder {
            color: #c8cacc;
            font-size: 30rpx;
          }
        }

        &__prefix {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56rpx;
          margin-right: 20rpx;
          flex-shrink: 0;
        }

        &__input {
          flex: 1;
          height: 100%;
        }

        &__suffix {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56rpx;
          margin-left: 20rpx;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
