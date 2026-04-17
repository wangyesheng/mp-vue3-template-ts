<template>
  <app-container>
    <div class="invoice-page">
      <month-switcher v-model="currentMonth" />
      <!-- 统计卡片 -->
      <div class="stats-row">
        <div class="stat-card uninvoiced">
          <div class="stat-label">未开票金额</div>
          <div class="stat-amount">¥ {{ invoiceOverviewInfo.un_invoiced_amount }}</div>
          <div class="stat-sub">{{ invoiceOverviewInfo.un_invoiced_count }} 单待开票</div>
        </div>
        <div class="stat-card invoiced">
          <div class="stat-label">已开票金额</div>
          <div class="stat-amount">¥ {{ invoiceOverviewInfo.invoiced_amount }}</div>
          <div class="stat-sub">{{ invoiceOverviewInfo.invoiced_count }} 单已开票</div>
        </div>
      </div>
      <nut-tabs v-if="currentMonth" v-model="checkedInvoiceTabKey">
        <nut-tab-pane
          v-for="item in invoiceTypes"
          :key="`${item.key}-${currentMonth}`"
          :title="item.label"
          :pane-key="item.key"
        >
          <page-list
            :ref="(ref) => setPageListRef(item, ref)"
            :api="getInvoiceListRes"
            :params="{ month: currentMonth, is_invoiced: item.key }"
            :active="checkedInvoiceTabKey == item.key"
            :render-type="item.key == 0 || item.key == 3 ? 'checkbox' : 'text'"
          >
            <template #item="{ data }">
              <div class="order-card">
                <div class="card-body">
                  <div class="order-top">
                    <span class="service-name">{{ data.service_name }}</span>
                    <span class="order-total"> ¥ {{ data.total_amount }} </span>
                  </div>
                  <div class="order-mid">
                    <span class="car-info">{{ data.vehicle_type }}</span>
                    <div class="fee-tags">
                      <span class="fee-tag">工时 ¥{{ data.hour_price }}</span>
                      <span class="fee-tag reward">奖励 ¥{{ data.reward_price }}</span>
                    </div>
                  </div>
                  <div class="order-bottom">
                    <span>订单号：{{ data.order_sn }}</span>
                    <span class="ml-1 text-[var(--uvt-primary-color)]" @click="copy(data.order_sn)">
                      复制
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </page-list>
        </nut-tab-pane>
      </nut-tabs>

      <!-- 底部开票栏 -->
      <div v-if="currentSelectedInvoiceKeys.length > 0" class="invoice-bar">
        <nut-button
          block
          size="large"
          type="primary"
          custom-color="linear-gradient(135deg, #22c55e, #16a34a)"
          @tap="navTo(`/pages/invoice/apply?ids=${currentSelectedInvoiceKeys.join()}`)"
        >
          {{ isReturn ? '重新提交' : '开具发票' }}
        </nut-button>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import { getInvoiceListRes, getOrderSummaryRes } from '@/api'
import { setPageListRef } from '@/components/PageList/instance'
import type { PageListInstanceHolder } from '@/components/PageList/instance'
import type { InvoiceType as InvoiceTypeBase } from '@/const'
import { INVOICE_TYPES } from '@/const'
import { useAppStore } from '@/stores/app'
import { copy, navTo } from '@/utils/uni'

interface InvoiceType extends InvoiceTypeBase, PageListInstanceHolder {}

const appStore = useAppStore()
const invoiceTypes = ref<InvoiceType[]>(
  INVOICE_TYPES.map((x) => ({ ...x, instance: null }) as InvoiceType),
)

const currentMonth = ref(),
  invoiceOverviewInfo = ref<Partial<IInvoiceOverviewInfo>>({}),
  checkedInvoiceTabKey = ref(0)

const currentInvoiceTab = computed(() => {
    const tab = invoiceTypes.value.find((x) => x.key == checkedInvoiceTabKey.value)
    return tab
  }),
  isReturn = computed(() => currentInvoiceTab.value?.key == 3),
  currentSelectedInvoiceKeys = computed(() => {
    return currentInvoiceTab.value?.instance?.getSelectedKeys() ?? []
  })

watch(() => currentMonth.value, getInvoiceOverview)

async function getInvoiceOverview() {
  if (!currentMonth.value) return
  const data = await getOrderSummaryRes(currentMonth.value)
  invoiceOverviewInfo.value = data
}

onShow(() => {
  if (appStore.checkNeedRefresh()) {
    getInvoiceOverview()
    currentInvoiceTab.value?.instance?.refresh()
  }
})

onPullDownRefresh(getInvoiceOverview)
</script>

<style lang="scss" scoped>
.invoice-page {
  padding: 32rpx;
  padding-bottom: 160rpx;
  background: var(--uvt-primary-bg-color);

  :deep() {
    .nut-tab-pane {
      padding: 0 !important;
      margin-top: 20rpx;
      background: transparent !important;
    }
  }
}

// 统计卡片
.stats-row {
  margin-top: 30rpx;
  display: flex;
  gap: 20rpx;

  .stat-card {
    flex: 1;
    display: flex;
    gap: 8rpx;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding: 12rpx 10rpx;
    border-radius: 20rpx;

    &.uninvoiced {
      background: linear-gradient(135deg, #fff7ed, #ffedd5);
      border: 2rpx solid #f97316;

      .stat-amount {
        color: #f97316;
      }
    }

    &.invoiced {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      border: 2rpx solid #22c55e;

      .stat-amount {
        color: #22c55e;
      }
    }

    .stat-label {
      margin-bottom: 4rpx;
      font-size: 24rpx;
      color: #6b7280;
    }

    .stat-amount {
      margin-bottom: 4rpx;
      font-size: 32rpx;
      font-weight: 700;
    }

    .stat-sub {
      font-size: 22rpx;
      color: #9ca3af;
    }
  }
}

.order-card {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
  padding: 28rpx;
  background: #fff;
  border: 2rpx solid transparent;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgb(0 0 0 / 3%);
  transition: all 0.2s;

  &.selected {
    border-color: #22c55e;
    background: #f0fdf4;
  }

  &.invoiced-card {
    display: block;
    padding: 28rpx;
  }

  .card-left {
    padding-top: 4rpx;
    flex-shrink: 0;
  }

  .card-body {
    flex: 1;

    .order-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .service-name {
        font-size: 30rpx;
        font-weight: 700;
        color: #1a1a2e;
      }

      .order-total {
        font-size: 32rpx;
        font-weight: 700;
        color: #1a1a2e;
      }
    }

    .order-mid {
      display: flex;
      gap: 8rpx;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .car-emoji {
        font-size: 24rpx;
      }

      .car-info {
        font-size: 26rpx;
        color: #6b7280;
      }
    }

    .fee-tags {
      display: flex;
      gap: 10rpx;

      .fee-tag {
        padding: 4rpx 12rpx;
        font-size: 22rpx;
        color: #22c55e;
        background: #ebf9f0;
        border-radius: 8rpx;

        &.reward {
          color: #f59e0b;
          background: #fffbeb;
        }
      }
    }

    .order-bottom {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #9ca3af;
    }

    .invoice-info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16rpx;
      margin-top: 16rpx;
      border-top: 1rpx dashed #e5e7eb;

      .invoice-no-wrap {
        display: flex;
        gap: 8rpx;
        align-items: center;

        .invoice-icon {
          font-size: 26rpx;
        }

        .invoice-no {
          font-size: 26rpx;
          color: #374151;
        }
      }

      .invoiced-tag {
        padding: 4rpx 14rpx;
        font-size: 22rpx;
        font-weight: 600;
        color: #22c55e;
        background: #dcfce7;
        border-radius: 20rpx;
      }
    }
  }
}

// 底部开票栏
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
</style>
