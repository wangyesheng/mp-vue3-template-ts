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
            <div class="detail-card">
              <!-- 卡片顶部 -->
              <div class="card-top">
                <div class="card-left">
                  <div class="service-name">{{ data.service_name }}</div>
                  <div class="car-info">
                    <span>{{ data.vehicle_type }}</span>
                  </div>
                </div>
                <div class="card-right">
                  <div class="total-price">¥ {{ data.total_amount }}</div>
                  <div>
                    <span
                      class="status-tag mr-1"
                      :class="[data.hour_price_settle == 0 ? 'pending' : 'settled']"
                    >
                      {{ data.hour_price_settle == 0 ? '工时费待结算' : '工时费已结算' }}
                    </span>
                    <span
                      class="status-tag"
                      :class="[data.reward_price_settle == 0 ? 'pending' : 'settled']"
                    >
                      {{ data.reward_price_settle == 0 ? '奖励金待结算' : '奖励金已结算' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 分隔线 -->
              <div class="card-divider" />

              <!-- 卡片底部 -->
              <div class="card-bottom">
                <div class="fee-row">
                  <div class="fee-item">
                    <span class="fee-label">工时费</span>
                    <span class="fee-value">¥ {{ data.hour_price }}</span>
                  </div>
                  <div class="fee-sep" />
                  <div class="fee-item">
                    <span class="fee-label">奖励金</span>
                    <span class="fee-value reward">¥ {{ data.reward_price }}</span>
                  </div>
                </div>
                <div class="order-row">
                  <span>订单号：{{ data.order_sn }}</span>
                  <span class="ml-1 text-[var(--uvt-primary-color)]" @click="copy(data.order_sn)">
                    复制
                  </span>
                </div>
              </div>
            </div>
          </template>
        </PageList>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import { getOrderSummaryListRes, getOrderSummaryRes } from '@/api'
import type { PageListInstance } from '@/components/PageList/instance'
import { copy } from '@/utils/uni'

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
    console.log(newValue, oldValue)
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

// 明细卡片
.detail-card {
  padding: 32rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgb(0 0 0 / 3%);

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .card-left {
      flex: 1;

      .service-name {
        margin-bottom: 12rpx;
        font-size: 32rpx;
        font-weight: 700;
        color: #1a1a2e;
      }

      .car-info {
        display: flex;
        gap: 8rpx;
        align-items: center;
        font-size: 26rpx;
        color: #6b7280;

        .car-icon-text {
          font-size: 24rpx;
        }
      }
    }

    .card-right {
      display: flex;
      flex-direction: column;
      gap: 10rpx;
      align-items: flex-end;

      .total-price {
        font-size: 36rpx;
        font-weight: 700;
        color: #1a1a2e;
      }

      .status-tag {
        padding: 6rpx 16rpx;
        font-size: 22rpx;
        font-weight: 500;
        border-radius: 20rpx;

        &.settled {
          color: #22c55e;
          background: #dcfce7;
        }

        &.pending {
          color: #6a6a6a;
          background: #f2f1f1;
        }
      }
    }
  }

  .card-divider {
    height: 1rpx;
    margin-bottom: 24rpx;
    background: #f0f2f5;
  }

  .card-bottom {
    .fee-row {
      display: flex;
      align-items: center;
      padding: 20rpx 24rpx;
      margin-bottom: 20rpx;
      background: #f8fafc;
      border-radius: 16rpx;

      .fee-item {
        display: flex;
        flex: 1;
        gap: 12rpx;
        align-items: center;

        .fee-label {
          font-size: 26rpx;
          color: #9ca3af;
        }

        .fee-value {
          font-size: 28rpx;
          font-weight: 600;
          color: #22c55e;

          &.reward {
            color: #f59e0b;
          }
        }
      }

      .fee-sep {
        width: 1rpx;
        height: 36rpx;
        margin: 0 24rpx;
        background: #e5e7eb;
      }
    }

    .order-row {
      display: flex;
      align-items: center;
      color: #9ca3af;
      font-size: 24rpx;
    }
  }
}
</style>
