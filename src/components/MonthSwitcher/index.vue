<template>
  <!-- 顶部月份选择器 -->
  <div class="month-bar">
    <div class="month-arrow" @click="prev">
      <nut-icon name="rect-left" custom-color="#333"></nut-icon>
    </div>
    <div class="month-label">
      <text class="month-text">{{ monthLabel }}</text>
      <text v-if="isCurrentMonth" class="month-tag">本月</text>
    </div>
    <div class="month-arrow" :class="{ disabled: isCurrentMonth }" @click="next">
      <nut-icon name="rect-right" custom-color="#333"></nut-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
})
const emits = defineEmits(['update:modelValue'])

const DEFAULT_VALUE = dayjs().format('YYYY-MM')

const isCurrentMonth = computed(() => {
    const now = dayjs()
    return now.format('YYYY-MM') == props.modelValue
  }),
  monthLabel = computed(() => {
    const date = dayjs(props.modelValue),
      y = date.year(),
      m = date.month() + 1
    return `${y} 年 ${m} 月`
  })

// 父组件没传 v-model 时，挂载后主动 emit 默认值，让父组件同步拿到
onMounted(() => {
  if (!props.modelValue) {
    emits('update:modelValue', DEFAULT_VALUE)
  }
})

function prev() {
  const d = dayjs(props.modelValue).subtract(1, 'month')
  emits('update:modelValue', d.format('YYYY-MM'))
}

function next() {
  if (isCurrentMonth.value) return
  const d = dayjs(props.modelValue).add(1, 'month')
  emits('update:modelValue', d.format('YYYY-MM'))
}
</script>

<style lang="scss" scoped>
// 月份选择
.month-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgb(0 0 0 / 4%);

  .month-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 64rpx;
    background: #f5f6fa;
    border-radius: 16rpx;

    &.disabled {
      opacity: 0.35;
    }
  }

  .month-label {
    display: flex;
    gap: 12rpx;
    align-items: center;

    .month-text {
      font-size: 34rpx;
      font-weight: 700;
      color: #1a1a2e;
    }

    .month-tag {
      padding: 4rpx 14rpx;
      font-size: 22rpx;
      font-weight: 600;
      color: #22c55e;
      background: #dcfce7;
      border-radius: 20rpx;
    }
  }
}
</style>
