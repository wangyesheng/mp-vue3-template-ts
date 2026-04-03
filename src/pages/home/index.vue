<template>
  <app-container>
    <div class="store">
      <div class="user-card">
        <div class="avatar">
          <image class="shadow-md" mode="aspectFill" :src="appUser?.avatar" />
        </div>

        <div class="flex-1">
          <div class="mb-2 text-lg font-bold tracking-tight text-gray-800">
            {{ appUser?.nickname }}
          </div>
          <div class="flex items-center gap-x-1 text-sm text-gray-400">
            <span class="i-mdi-phone"></span>
            <span>{{ appUser?.mobile }}</span>
          </div>
        </div>

        <nut-button plain size="mini" type="primary" @click="navTo('/pages/password/index')">
          修改密码
        </nut-button>
      </div>

      <div class="section">
        <div class="section-head">
          <span class="title">结算概览</span>
          <span class="more" @click="navTo('/pages/settlement/index')">查看全部</span>
        </div>
        <Summary />
      </div>

      <!-- 订单管理 -->
      <div class="section">
        <div class="section-head">
          <span class="title">订单管理</span>
        </div>

        <nut-tabs v-model="currentOrderType">
          <nut-tab-pane
            v-for="item in orderTypes"
            :key="item.key"
            :title="item.label"
            :pane-key="item.key"
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
                      <div class="car-icon">
                        <text>🚗</text>
                      </div>
                      <div class="info">
                        <div class="name-wrap">
                          <span class="name">{{ data.vehicle_type }}</span>
                        </div>
                        <div class="sn flex items-center gap-x-1">
                          <span class="i-mdi-cellphone-android text-[#888]"></span>
                          {{ data.user?.mobile }}
                        </div>
                      </div>
                    </div>
                    <div class="price-wrap">
                      <div class="price">¥ {{ data.hour_price }}</div>
                      <div class="desc">工时费</div>
                    </div>
                  </div>

                  <div class="detail-list">
                    <div class="detail-item">
                      <span class="icon i-mdi-invoice-text-multiple"></span>
                      <span class="label">订单号</span>
                      <span class="value">{{ data.order_sn }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="icon i-mdi-car-wrench"></span>
                      <span class="label">产品</span>
                      <span class="value">{{ data.product_name }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="icon i-mdi-car-wrench"></span>
                      <span class="label">服务项目</span>
                      <span class="value">{{ data.service_name }}</span>
                    </div>
                  </div>

                  <div v-if="item.key == 1" class="actions">
                    <nut-button block plain size="large" @click="callPhone(data.user?.mobile)">
                      联系客户
                    </nut-button>
                    <nut-button
                      block
                      custom-color="#1a1a2e"
                      size="large"
                      @click="navTo(`/pages/completion/index?id=${data.id}&type=before`)"
                    >
                      开始施工 / 录入
                    </nut-button>
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
import { getOrdersRes } from '@/api'
import { setPageListRef } from '@/components/PageList/instance'
import type { PageListInstanceHolder } from '@/components/PageList/instance'
import { useAppStore } from '@/stores/app'
import { callPhone, navTo } from '@/utils/uni'

type OrderTypeKey = 1 | 2 | 3 | 4 | 5

interface OrderType extends PageListInstanceHolder {
  key: OrderTypeKey
  label: string
}

const orderTypes = ref<OrderType[]>([
  { key: 1, label: '待施工', instance: null },
  { key: 2, label: '施工中', instance: null },
  { key: 3, label: '待确认', instance: null },
  { key: 4, label: '已完成', instance: null },
  { key: 5, label: '售后处理', instance: null },
])
const appStore = useAppStore()
const { appToken, appUser } = storeToRefs(appStore)
const currentOrderType = ref<OrderTypeKey>(1)

onShow(() => {
  if (!appToken.value) {
    navTo('/pages/login/index')
    return
  }
  // 仅从「施工/完工录入」等页面返回时需要拉最新列表；其它 onShow（切后台回来）不强制刷新
  if (appStore.checkHomeOrderListNeedRefresh()) {
    refresh()
  }
})

function refresh() {
  const current = orderTypes.value.find((x) => x.key == currentOrderType.value)
  current?.instance?.refresh()
}
</script>

<style lang="scss" scoped>
.store {
  .user-card {
    display: flex;
    gap: 24rpx;
    align-items: center;
    padding: 32rpx;
    margin: 32rpx;
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 12rpx 40rpx rgb(34 197 94 / 10%);

    .avatar {
      position: relative;
      image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 20rpx;
      }

      &::after {
        content: '';
        width: 30rpx;
        height: 30rpx;
        border-radius: 50%;
        background: var(--uvt-primary-color);
        position: absolute;
        bottom: 0;
        right: -10rpx;
        border: 2rpx solid #fff;
      }
    }
  }

  ::v-deep() {
    .nut-tab-pane {
      padding: 0 !important;
      background: transparent !important;
    }
  }

  .dashboard {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;
    padding: 32rpx;

    .data-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32rpx;
      background: #fff;
      border-radius: 24rpx;
      box-shadow: 0 4rpx 20rpx rgb(0 0 0 / 2%);

      .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64rpx;
        height: 64rpx;
        margin-bottom: 16rpx;
        border-radius: 50%;

        text {
          font-size: 32rpx;
        }

        &.success {
          color: #22c55e;
          background: #dcfce7;
        }

        &.warning {
          color: #f97316;
          background: #ffedd5;
        }

        &.primary {
          color: #3b82f6;
          background: #e0e7ff;
        }

        &.purple {
          color: #a855f7;
          background: #f3e8ff;
        }
      }

      .label {
        margin-bottom: 8rpx;
        font-size: 26rpx;
        color: #666;
      }

      .value {
        font-size: 36rpx;
        font-weight: bold;
        color: #1a1a2e;

        &.up {
          color: #22c55e;
        }
      }
    }
  }

  .section {
    padding: 0 32rpx;
    margin-bottom: 48rpx;

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;

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
        margin-bottom: 30rpx;

        .car-info {
          display: flex;
          gap: 20rpx;
          align-items: center;
          width: 70%;

          .car-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80rpx;
            height: 80rpx;
            background: #f5f6fa;
            border-radius: 20rpx;

            text {
              font-size: 40rpx;
            }

            &.success {
              color: #22c55e;
              background: #dcfce7;
            }
          }

          .info {
            flex: 1;

            .name-wrap {
              display: flex;
              gap: 12rpx;
              align-items: center;
              margin-bottom: 8rpx;

              .name {
                font-size: 32rpx;
                font-weight: bold;
                color: #1a1a2e;
              }

              .tag {
                padding: 4rpx 12rpx;
                font-size: 20rpx;
                border-radius: 8rpx;

                &.pending {
                  color: #94a3b8;
                  background: #f1f5f9;
                }

                &.done {
                  color: #22c55e;
                  background: #dcfce7;
                }
              }
            }

            .sn {
              font-size: 24rpx;
              color: #888;
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
      }

      .detail-list {
        display: flex;
        flex-direction: column;
        gap: 16rpx;
        padding: 24rpx;
        margin-bottom: 32rpx;
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
          }
        }
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 16rpx;
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

    .invoice-entry {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx 32rpx;
      margin-top: 16rpx;
      background: linear-gradient(135deg, #fffbeb, #fef9c3);
      border: 2rpx solid #fde68a;
      border-radius: 20rpx;

      .invoice-entry-left {
        display: flex;
        gap: 20rpx;
        align-items: center;

        .entry-icon {
          font-size: 48rpx;
        }

        .entry-info {
          .entry-title {
            margin-bottom: 6rpx;
            font-size: 30rpx;
            font-weight: 700;
            color: #92400e;
          }

          .entry-sub {
            font-size: 24rpx;
            color: #b45309;
          }
        }
      }

      .entry-arrow {
        font-size: 44rpx;
        font-weight: 300;
        color: #d97706;
      }
    }

    .after-sale-card {
      display: flex;
      overflow: hidden;
      background: #fff;
      border-left: 10rpx solid #f97316;
      border-radius: 24rpx;
      box-shadow: 0 4rpx 24rpx rgb(0 0 0 / 3%);

      .card-content {
        flex: 1;
        padding: 32rpx;

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12rpx;

          .title {
            font-size: 30rpx;
            font-weight: bold;
            color: #1a1a2e;
          }

          .tag {
            padding: 4rpx 12rpx;
            font-size: 22rpx;
            border-radius: 8rpx;

            &.warning {
              color: #f97316;
              background: #fff7ed;
            }
          }
        }

        .time {
          margin-bottom: 24rpx;
          font-size: 24rpx;
          color: #888;
        }

        .desc-box {
          padding: 20rpx;
          margin-bottom: 32rpx;
          font-size: 26rpx;
          line-height: 1.5;
          background: #f8fafc;
          border-radius: 12rpx;

          .label {
            font-weight: bold;
            color: #333;
          }

          .content {
            color: #666;
          }
        }

        .actions {
          display: flex;
          gap: 32rpx;
          align-items: center;
          justify-content: flex-end;

          .btn-text {
            font-size: 28rpx;
            color: #888;
          }

          .btn-primary {
            height: 64rpx;
            padding: 0 40rpx;
            font-size: 26rpx;
            border-radius: 12rpx;

            &.orange {
              background: #f97316;
              border-color: #f97316;
            }
          }
        }
      }
    }
  }
}
</style>
