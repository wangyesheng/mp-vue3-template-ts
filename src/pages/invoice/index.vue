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
        >
          <page-list
            :ref="(ref) => setPageListRef(item, ref)"
            :api="getInvoiceListRes"
            :params="{ month: currentMonth, is_invoiced: item.key }"
            :active="checkedInvoiceTabKey == item.key"
            :render-type="item.key == 0 || item.key == 3 ? 'checkbox' : 'text'"
            :item-key="(row: any) => `${row.id}-${currentMonth}`"
          >
            <template #item="{ data }">
              <div class="order-summary-card">
                <!-- 卡片顶部 -->
                <div class="card-top">
                  <div class="service-name-price">
                    <span>
                      {{ data?.service_name }}
                    </span>
                    <span class="total-price">¥ {{ data?.total_amount }}</span>
                  </div>
                  <div class="card-footer">
                    <div>{{ data?.vehicle_type }}</div>
                    <div class="fee">总费用</div>
                  </div>
                </div>

                <!-- 分隔线 -->
                <div class="card-divider" />

                <!-- 卡片底部 -->
                <div class="card-bottom">
                  <div class="fee-row">
                    <div class="fee-item">
                      <span class="fee-label">工时费</span>
                      <span class="fee-value">¥{{ data?.hour_price }}</span>
                    </div>
                    <div class="fee-sep" />
                    <div class="fee-item">
                      <span class="fee-label">奖励金</span>
                      <span class="fee-value">¥{{ data?.reward_price }}</span>
                    </div>
                  </div>
                  <div class="order-row">
                    <span>订单号：{{ data?.order_sn }}</span>
                    <span
                      class="ml-1 text-[var(--uvt-primary-color)]"
                      @click="copy(data?.order_sn!)"
                    >
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
  invoiceOverviewInfo = ref<Partial<ISummaryInfo>>({}),
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
  if (appStore.checkNeedRefresh(false)) {
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
