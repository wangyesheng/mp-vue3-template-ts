<script setup lang="ts">
import { useLogin } from '@/hooks/useLogin'

const { login, getPhoneNumber, bindMobileVisible } = useLogin()
</script>

<template>
  <view class="login-page">
    <!-- 顶部装饰 -->

    <!-- 主体内容 -->
    <view class="content">
      <!-- Logo 区域 -->
      <view class="logo-wrap">
        <view class="logo">
          <text class="logo-icon">🚗</text>
        </view>
        <text class="app-name">轩科施工管理端</text>
        <text class="app-desc">专业的汽车美容店管理助手</text>
      </view>

      <!-- 特性说明 -->
      <view class="features">
        <view class="feature-item">
          <text class="feature-icon">📊</text>
          <text class="feature-text">订单管理一目了然</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">💰</text>
          <text class="feature-text">结算数据实时追踪</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🔔</text>
          <text class="feature-text">售后提醒及时处理</text>
        </view>
      </view>
    </view>

    <!-- 底部登录区 -->
    <view class="login-footer">
      <button class="login-btn" open-type="getUserInfo" @click="login">
        <text class="btn-text">立即登录</text>
      </button>

      <text class="privacy-text">
        登录即代表同意
        <text class="privacy-link">《用户协议》</text>
        和
        <text class="privacy-link">《隐私政策》</text>
      </text>
    </view>

    <BindMobile v-model:visible="bindMobileVisible" :get-phone-number="getPhoneNumber" />
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  background: #f5f6fa;

  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 80rpx;
    padding-top: 160rpx;

    .logo-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 96rpx;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160rpx;
        height: 160rpx;
        margin-bottom: 40rpx;
        font-size: 80rpx;
        background: linear-gradient(135deg, #22c55e, #11cc56);
        border-radius: 40rpx;
        box-shadow: 0 20rpx 60rpx rgba(34, 197, 94, 0.2);
      }

      .app-name {
        margin-bottom: 16rpx;
        font-size: 52rpx;
        font-weight: 700;
        color: #1a1a2e;
        letter-spacing: 4rpx;
      }

      .app-desc {
        font-size: 28rpx;
        color: #9ca3af;
      }
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 28rpx;
      width: 100%;

      .feature-item {
        display: flex;
        gap: 24rpx;
        align-items: center;
        padding: 28rpx 36rpx;
        background: #fff;
        border-radius: 20rpx;
        box-shadow: 0 4rpx 24rpx rgb(0 0 0 / 5%);

        .feature-icon {
          font-size: 40rpx;
        }

        .feature-text {
          font-size: 30rpx;
          font-weight: 500;
          color: #374151;
        }
      }
    }
  }

  .login-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 80rpx 80rpx;
    padding-bottom: calc(80rpx + env(safe-area-inset-bottom));

    .login-btn {
      display: flex;
      gap: 16rpx;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 104rpx;
      margin-bottom: 32rpx;
      font-size: 34rpx;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, #22c55e, #15c455);
      border: none;
      border-radius: 52rpx;
      box-shadow: 0 16rpx 48rpx rgba(34, 197, 94, 0.3);
      transition: opacity 0.2s;

      &::after {
        border: none;
      }

      &.loading {
        opacity: 0.7;
      }

      .btn-icon {
        font-size: 36rpx;
      }

      .btn-text {
        font-size: 34rpx;
        font-weight: 600;
        color: #fff;
      }
    }

    .privacy-text {
      font-size: 24rpx;
      color: #9ca3af;

      .privacy-link {
        color: #22c55e;
      }
    }
  }
}
</style>
