<template>
  <app-container>
    <div class="store">
      <div class="user-card">
        <div class="avatar">
          <image mode="aspectFill" :src="appUser?.avatar" />
        </div>

        <div class="flex-1">
          <div class="mb-1 text-base font-bold tracking-tight text-[#121836]">
            {{ appUser?.nickname }}
          </div>
          <div class="flex items-center text-sm text-[#888]">
            <span>{{ appUser?.mobile }}</span>
          </div>
        </div>

        <nut-button plain size="mini" type="primary" @click="navTo('/pages/password/index')">
          修改密码
        </nut-button>
      </div>

      <div class="section">
        <div class="section-head mb-3">
          <span class="title">结算概览</span>
          <span class="more" @click="navTo('/pages/settlement/index')">查看全部</span>
        </div>
        <Summary :data="summaryInfo" />
      </div>

      <div class="section">
        <div class="invoice-entry" @tap="navTo('/pages/invoice/index')">
          <div class="invoice-entry-left">
            <image src="@/static/images/invoice2.png" class="entry-icon"></image>
            <div class="entry-info">
              <div class="entry-title">待开发票</div>
              <div class="entry-sub">
                <span v-if="summaryInfo.un_invoiced_amount ?? 0 > 0">
                  本月有 {{ summaryInfo.un_invoiced_count }} 单待开票，点击前往处理
                </span>
                <span v-else>本月暂无发票待开，点击查看往期开票数据</span>
              </div>
            </div>
          </div>
          <nut-icon name="rect-right" custom-color="#f28519" />
        </div>
      </div>

      <!-- 订单管理 -->
      <div class="section">
        <div class="section-head">
          <span class="title">订单管理</span>
        </div>

        <nut-tabs v-model="currentOrderType" auto-height>
          <nut-tab-pane
            v-for="item in orderTypes"
            :key="item.key"
            :title="item.label"
            :pane-key="item.key"
            :custom-class="currentOrderType == item.key ? 'mount' : 'unmount'"
          >
            <PageList
              :ref="(el) => setPageListRef(item, el)"
              :api="getOrdersRes"
              :active="currentOrderType == item.key"
              :params="{ status: item.key }"
            >
              <template #item="{ data }">
                <div class="order-card">
                  <div class="card-header">
                    <div class="car-info">
                      <div class="info">
                        <div class="name-wrap">
                          <span class="name">{{ data.vehicle_type }}</span>
                        </div>
                        <div class="sn">
                          <span>订单号：{{ data.order_sn }}</span>
                          <span class="copy" @click="copy(data.order_sn)">复制</span>
                        </div>
                      </div>
                    </div>
                    <span
                      v-if="item.key == 4"
                      class="status-tag"
                      :class="[INVOICE_MAP[data.is_invoiced].type]"
                    >
                      {{ INVOICE_MAP[data.is_invoiced].label }}
                    </span>
                  </div>

                  <div class="detail-list">
                    <div class="detail-item">
                      <span class="label">客户手机号</span>
                      <span class="value">{{ data.user?.mobile }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">产品</span>
                      <span class="value">{{ data.product_name }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">服务项目</span>
                      <span class="value">{{ data.service_name }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">工时费</span>
                      <span class="value fee">¥ {{ data.hour_price }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">奖励金</span>
                      <span class="value fee">¥ {{ data.reward_price }}</span>
                    </div>
                  </div>

                  <div v-if="item.key == 1" class="actions">
                    <div class="inner">
                      <nut-button plain size="large" @click="callPhone(data.user?.mobile)">
                        联系客户
                      </nut-button>
                      <nut-button
                        custom-color="#1a1a2e"
                        size="large"
                        @click="navTo(`/pages/completion/index?id=${data.id}&type=before`)"
                      >
                        开始施工 / 录入
                      </nut-button>
                    </div>
                  </div>
                  <div v-if="item.key == 2" class="actions">
                    <nut-button
                      block
                      type="primary"
                      size="large"
                      @click="navTo(`/pages/completion/index?id=${data.id}&type=after`)"
                    >
                      完成施工
                    </nut-button>
                  </div>
                  <div v-if="item.key == 5" class="text-right">
                    <nut-tag v-if="data.aftersale_type == 0" round plain type="warning">
                      待平台处理
                    </nut-tag>
                    <nut-button
                      v-if="data.aftersale_type == 1"
                      block
                      plain
                      type="success"
                      size="large"
                      @click="navTo(`/pages/after-sale/index?id=${data.aftersale_id}`)"
                    >
                      {{ data.handle_status == 2 ? '查看售后' : '处理售后' }}
                    </nut-button>
                    <nut-tag v-if="data.aftersale_type == 2" round plain type="warning">
                      平台已更换新门店
                    </nut-tag>
                  </div>
                </div>
              </template>
            </PageList>
          </nut-tab-pane>
        </nut-tabs>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import { getOrdersRes, getOrderSummaryRes } from '@/api'
import { setPageListRef } from '@/components/PageList/instance'
import type { PageListInstanceHolder } from '@/components/PageList/instance'
import { INVOICE_MAP } from '@/const'
import { useAppStore } from '@/stores/app'
import { callPhone, copy, navTo } from '@/utils/uni'
import dayjs from 'dayjs'

type OrderTypeKey = 1 | 2 | 3 | 4 | 5
interface OrderType extends PageListInstanceHolder {
  key: OrderTypeKey
  label: string
}

const appStore = useAppStore()
const { appToken, appUser } = storeToRefs(appStore)

const orderTypes = ref<OrderType[]>([
    { key: 1, label: '待施工', instance: null },
    { key: 2, label: '施工中', instance: null },
    { key: 3, label: '待确认', instance: null },
    { key: 4, label: '已完成', instance: null },
    { key: 5, label: '售后', instance: null },
  ]),
  currentOrderType = ref<OrderTypeKey>(1),
  summaryInfo = ref<Partial<ISummaryInfo>>({})

function refresh() {
  const current = orderTypes.value.find((x) => x.key == currentOrderType.value)
  current?.instance?.refresh()
}

async function getOrderSummary() {
  try {
    uni.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    const month = dayjs().format('YYYY-MM')
    const data = await getOrderSummaryRes(month)
    summaryInfo.value = data
  } finally {
    uni.hideLoading()
  }
}

onShow(() => {
  if (!appToken.value) {
    navTo('/pages/login/index')
    return
  }
  // 仅从「施工/完工录入」等页面返回时需要拉最新列表；其它 onShow（切后台回来）不强制刷新
  if (appStore.checkNeedRefresh()) {
    refresh()
  }

  getOrderSummary()
})

onPullDownRefresh(getOrderSummary)
</script>

<style lang="scss" scoped>
.store {
  .user-card {
    display: flex;
    gap: 24rpx;
    align-items: center;
    margin: 32rpx;

    .avatar {
      position: relative;
      width: 130rpx;
      height: 130rpx;
      border: 4rpx solid #fff;
      padding: 5rpx;
      border-radius: 50%;

      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  ::v-deep() {
    .nut-tab-pane {
      padding: 0 !important;
      margin-top: 10rpx !important;
      background: transparent !important;

      &.mount {
        height: 100% !important;
      }

      &.unmount {
        height: 0 !important;
      }
    }
  }

  .invoice-entry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    background: linear-gradient(135deg, #fffaed, #ffe3be);
    border: 2rpx solid #ffc375;
    border-radius: 20rpx;

    .invoice-entry-left {
      display: flex;
      gap: 20rpx;
      align-items: center;

      .entry-icon {
        width: 64rpx;
        height: 64rpx;
      }

      .entry-info {
        .entry-title {
          margin-bottom: 5rpx;
          font-size: 28rpx;
          font-weight: 700;
          color: #f28519;
        }

        .entry-sub {
          font-size: 24rpx;
          color: #f28519;
        }
      }
    }
  }

  .section {
    padding: 0 32rpx;
    margin-bottom: 30rpx;

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 34rpx;
        font-weight: bold;
        color: #1a1a2e;
      }

      .more {
        font-size: 26rpx;
        color: #22c55e;
      }
    }

    .order-card {
      padding: 32rpx;
      background: #fff;
      border-radius: 32rpx;
      box-shadow: 0 4rpx 24rpx rgb(0 0 0 / 3%);

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .car-info {
          display: flex;
          row-gap: 15rpx;
          align-items: center;
          width: 80%;

          .car-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64rpx;
            height: 64rpx;
            border-radius: 20rpx;

            image {
              width: 100%;
              height: 100%;
            }
          }

          .info {
            flex: 1;

            .name-wrap {
              display: flex;
              align-items: center;
              column-gap: 10rpx;
              margin-bottom: 10rpx;

              .name {
                font-size: 32rpx;
                font-weight: bold;
                color: #1a1a2e;
              }
            }

            .sn {
              font-size: 24rpx;
              color: #888;
              display: flex;
              align-items: center;
              column-gap: 10rpx;

              .copy {
                color: #22c55e;
              }
            }
          }
        }

        .price-info {
          text-align: right;

          .symbol {
            display: inline-block;
            font-size: 24rpx;
            font-weight: bold;
            color: #1a1a2e;
          }

          .amount {
            display: inline-block;
            font-size: 36rpx;
            font-weight: bold;
            color: #1a1a2e;
          }

          .status {
            margin-top: 4rpx;
            font-size: 22rpx;
            color: #999;
          }
        }

        .price-wrap {
          flex: 1;
          text-align: right;

          .price {
            font-size: 36rpx;
            font-weight: bold;
            color: #22c55e;
          }

          .desc {
            margin-top: 4rpx;
            font-size: 24rpx;
            color: #999;
          }
        }

        .status-tag {
          padding: 6rpx 15rpx;
          font-size: 24rpx;
          border-radius: 30rpx;

          &.reject {
            color: #cf1322;
            background: #fff1f0;
          }

          &.done {
            color: #22c55e;
            background: #dcfce7;
          }

          &.confirm {
            color: #1d39c4;
            background: #f0f5ff;
          }

          &.wait {
            color: #595959;
            background: #f5f5f5;
          }
        }

        .fee-tags {
          display: flex;
          flex-direction: column;
          gap: 10rpx;

          .fee-tag {
            padding: 6rpx 12rpx;
            font-size: 24rpx;
            color: #22c55e;
            background: #ebf9f0;
            border-radius: 8rpx;

            label:first-child {
              margin-right: 5rpx;
            }

            &.reward {
              color: #f59e0b;
              background: #fffbeb;
            }
          }
        }
      }

      .detail-list {
        display: flex;
        flex-direction: column;
        gap: 16rpx;
        padding: 24rpx;
        margin-bottom: 20rpx;
        background: #f8fafc;
        border-radius: 20rpx;

        .detail-item {
          display: flex;
          align-items: center;
          font-size: 26rpx;

          .icon {
            margin-right: 12rpx;
            font-size: 32rpx;
            color: var(--uvt-primary-color);
          }

          .label {
            width: 140rpx;
            color: #666;
          }

          .value {
            flex: 1;
            font-weight: 500;
            color: #1a1a2e;
            text-align: right;

            &.fee {
              color: #22c55e;
              font-size: 30rpx;
            }
          }
        }
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 16rpx;

        .inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          :deep() {
            button {
              width: 45%;
            }
          }
        }
      }

      &.mini {
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24rpx;
          margin-top: 32rpx;
          border-top: 2rpx dashed #f0f0f0;

          .time {
            font-size: 24rpx;
            color: #999;
          }

          .more-link {
            font-size: 24rpx;
            color: #22c55e;
          }

          .invoice-tag {
            padding: 6rpx 16rpx;
            font-size: 22rpx;
            font-weight: 600;
            border-radius: 20rpx;

            &.uninvoiced {
              color: #f97316;
              background: #fff7ed;
            }

            &.invoiced {
              color: #22c55e;
              background: #dcfce7;
            }
          }
        }
      }
    }
  }
}
</style>
