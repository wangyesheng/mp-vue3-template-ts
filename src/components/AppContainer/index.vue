<template>
  <nut-config-provider theme="light" :theme-vars="themeVars">
    <div class="app-contanier" :class="[customClass]">
      <nut-toast />
      <slot />
    </div>
  </nut-config-provider>
</template>

<script setup lang="ts">
defineProps({
  customClass: {
    type: String,
    default: '',
  },
})

const themeVars = reactive({
  primaryColor: '#22c55e',
  primaryColorEnd: '#22c55e',
  warningColor: '#f97316',
  warningColorEnd: '#f97316',
  tagPrimaryBackgroundColor: '#22c55e',
})
</script>

<style lang="scss">
.app-contanier {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
}
</style>
