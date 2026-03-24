<template>
  <nut-popup
    round
    pop-class="bind-mobile-popup"
    :visible="props.visible"
    @close="() => emits('update:visible', !props.visible)"
  >
    <div class="popup-wrap">
      <!-- 顶部图标 -->
      <div class="icon-wrap">
        <text class="icon">📱</text>
      </div>

      <!-- 标题 -->
      <div class="title">授权手机号</div>

      <!-- 描述 -->
      <div class="desc">为了更好地为您提供服务，需要获取您的手机号用于快捷登录</div>

      <!-- 授权按钮 -->
      <nut-button
        block
        type="primary"
        size="large"
        open-type="getPhoneNumber"
        custom-color="linear-gradient(135deg, #22c55e, #15c455);"
        @getphonenumber="props.getPhoneNumber"
      >
        <span class="btn-text">一键获取手机号</span>
      </nut-button>

      <!-- 取消 -->
      <div class="cancel" @tap="emits('update:visible', false)">暂不授权</div>
    </div>
  </nut-popup>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  getPhoneNumber: {
    type: [Function, null],
    default: null,
  },
})
const emits = defineEmits(['update:visible'])
</script>

<style lang="scss" scoped>
:deep(.bind-mobile-popup) {
  width: 80%;
}

.popup-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64rpx 56rpx 48rpx;

  .icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 40rpx;
    font-size: 56rpx;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
    border-radius: 32rpx;
  }

  .title {
    margin-bottom: 20rpx;
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: 2rpx;
  }

  .desc {
    margin-bottom: 56rpx;
    font-size: 28rpx;
    line-height: 1.6;
    color: #9ca3af;
    text-align: center;
  }

  .btn-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }

  .cancel {
    margin-top: 32rpx;
    font-size: 28rpx;
    color: #c4c9d4;
  }
}
</style>
