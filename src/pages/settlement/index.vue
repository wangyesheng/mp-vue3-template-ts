<template>
  <app-container>
    <div class="settlement-page">
      <!-- 顶部月份选择器 -->
      <MonthSwitcher v-model="currentMonth" />

      <!-- 汇总卡片 -->
      <Summary :data="summaryInfo" />

      <!-- 明细列表 -->
      <div class="detail-section">
        <div class="section-header">
          <span class="section-title">结算明细</span>
          <!-- <span class="section-count">共 {{ list.length }} 条</span> -->
        </div>

        <PageList
          ref="pageListRef"
          :active="Boolean(currentMonth)"
          :api="getOrderSummaryListRes"
          :params="{ month: currentMonth }"
        >
          <template #item="{ data }">
            <OrderInfo type="2" :data="data" />
          </template>
        </PageList>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import { getOrderSummaryListRes, getOrderSummaryRes } from '@/api'
import type { PageListInstance } from '@/components/PageList/instance'

const currentMonth = ref(),
  summaryInfo = ref<Partial<ISummaryInfo>>({}),
  pageListRef = ref<PageListInstance>()

async function getOrderSummary(month: string) {
  const data = await getOrderSummaryRes(month)
  summaryInfo.value = data
}

watch(
  () => currentMonth.value,
  (newValue, oldValue) => {
    getOrderSummary(newValue)
    if (oldValue) {
      pageListRef.value?.refresh()
    }
  },
)
</script>

<style lang="scss" scoped>
.settlement-page {
  background: var(--uvt-primary-bg-color);
  padding: 32rpx;
  padding-bottom: 48rpx;
  display: flex;
  flex-direction: column;
  row-gap: 30rpx;
}

// 明细区域
.detail-section {
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 34rpx;
      font-weight: 700;
      color: #1a1a2e;
    }

    .section-count {
      padding: 6rpx 18rpx;
      font-size: 24rpx;
      color: #6b7280;
      background: #fff;
      border-radius: 20rpx;
    }
  }
}
</style>
