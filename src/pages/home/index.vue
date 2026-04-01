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

        <nut-tabs v-model="orderType">
          <nut-tab-pane title="待施工" :pane-key="0">
            <PageList :api="getOrdersRes">
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
                      <span class="icon i-mdi-account"></span>
                      <span class="label">客户</span>
                      <span class="value">{{ data.user?.nickname }} ({{ data.user?.mobile }})</span>
                    </div>

                    <div class="detail-item">
                      <span class="icon i-mdi-car-wrench"></span>
                      <span class="label">服务项目</span>
                      <span class="value">{{ data.product_name }} - {{ data.service_name }}</span>
                    </div>
                  </div>

                  <div class="actions">
                    <nut-button block plain size="large" @click="callPhone(data.user?.mobile)">
                      联系客户
                    </nut-button>
                    <nut-button
                      block
                      custom-color="#1a1a2e"
                      size="large"
                      @click="navTo(`/pages/completion/index?id=${data.id}`)"
                    >
                      开始施工 / 录入
                    </nut-button>
                  </div>
                </div>
              </template>
            </PageList>
          </nut-tab-pane>

          <nut-tab-pane title="施工中">
            <div class="order-list">
              <!-- 待施工订单 -->
              <div class="order-card">
                <div class="card-header">
                  <div class="car-info">
                    <div class="car-icon">
                      <text>🚗</text>
                    </div>
                    <div class="info">
                      <div class="name-wrap">
                        <span class="name">奥迪 A6L 2023款</span>
                      </div>
                      <div class="sn">订单号：#36123217</div>
                    </div>
                  </div>
                  <div class="price-wrap">
                    <div class="price">¥ 450.00</div>
                    <div class="desc">预计工时费</div>
                  </div>
                </div>

                <div class="detail-list">
                  <div class="detail-item">
                    <span class="icon">👤</span>
                    <span class="label">客户</span>
                    <span class="value">李先生 (138****8888)</span>
                  </div>
                  <div class="detail-item">
                    <span class="icon">📅</span>
                    <span class="label">预约时间</span>
                    <span class="value">2023-12-21 14:00</span>
                  </div>
                  <div class="detail-item">
                    <span class="icon">🔧</span>
                    <span class="label">服务项目</span>
                    <span class="value">全车精洗 + 打蜡</span>
                  </div>
                </div>

                <div class="actions">
                  <nut-button
                    block
                    type="primary"
                    size="large"
                    @click="navTo('/pages/completion/index')"
                  >
                    完成施工
                  </nut-button>
                </div>
              </div>
            </div>
          </nut-tab-pane>

          <nut-tab-pane title="已完成">
            <!-- 已完成订单简略版 -->
            <div class="order-list">
              <div class="order-card mini">
                <div class="card-header">
                  <div class="car-info">
                    <div class="car-icon">
                      <text>🚗</text>
                    </div>
                    <div class="info">
                      <div class="name-wrap">
                        <span class="name">奥迪 A6L 2023款</span>
                        <!-- <span class="tag pending">待施工</span> -->
                      </div>
                      <div class="sn">订单号：#36123217</div>
                    </div>
                  </div>
                  <div class="price-wrap">
                    <div class="price">¥ 450.00</div>
                    <div class="desc">工时费</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="time">完工时间：2026-03-20 10:30</span>
                  <span class="invoice-tag uninvoiced">未开票</span>
                </div>
              </div>
              <div class="order-card mini">
                <div class="card-header">
                  <div class="car-info">
                    <div class="car-icon">
                      <text>🚗</text>
                    </div>
                    <div class="info">
                      <div class="name-wrap">
                        <span class="name">奥迪 A6L 2023款</span>
                        <!-- <span class="tag pending">待施工</span> -->
                      </div>
                      <div class="sn">订单号：#36123217</div>
                    </div>
                  </div>
                  <div class="price-wrap">
                    <div class="price">¥ 450.00</div>
                    <div class="desc">工时费</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="time">完工时间：2026-03-18 16:20</span>
                  <span class="invoice-tag invoiced">已开票</span>
                </div>
              </div>
            </div>
            <!-- 去开票入口 -->
            <div class="invoice-entry" @tap="navTo('/pages/invoice/index')">
              <div class="invoice-entry-left">
                <text class="entry-icon">🧾</text>
                <div class="entry-info">
                  <div class="entry-title">待结算资金</div>
                  <div class="entry-sub">本月有 2 单待结算，点击前往处理</div>
                </div>
              </div>
              <text class="entry-arrow">›</text>
            </div>
          </nut-tab-pane>
          <nut-tab-pane title="售后处理">
            <!-- 售后处理 -->
            <div class="after-sale-card">
              <div class="card-content">
                <div class="header">
                  <span class="title">订单 #36123009 售后申请</span>
                  <span class="tag warning">待处理</span>
                </div>
                <div class="time">申请时间：2023-12-20 09:15</div>
                <div class="desc-box">
                  <text class="label">问题描述：</text>
                  <text class="content">
                    客户反馈洗车后发现左前门把手处有细微划痕，请核实施工前照片。
                  </text>
                </div>
                <div class="actions">
                  <span class="btn-text">驳回</span>
                  <nut-button type="warning"> 处理售后 </nut-button>
                </div>
              </div>
            </div>
          </nut-tab-pane>
        </nut-tabs>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import { getOrdersRes } from '@/api'
import { useAppStore } from '@/stores/app'
import { callPhone, navTo } from '@/utils/uni'

const { appToken, appUser } = storeToRefs(useAppStore())
const orderType = ref(0)

onShow(() => {
  if (!appToken.value) {
    navTo('/pages/login/index')
  }
})
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
