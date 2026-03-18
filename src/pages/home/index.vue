<script setup lang="ts">
const orderType = ref(0)
</script>

<template>
  <AppContainer>
    <div class="store">
      <div class="section">
        <div class="section-head">
          <span class="title">结算概览</span>
          <span class="more">查看全部</span>
        </div>
        <div class="settlement-card">
          <div class="settlement-top">
            <div class="settlement-info">
              <div class="settlement-label">
                本月待结算总额
              </div>
              <div class="settlement-amount">
                <span class="currency">¥</span>
                <span class="amount">12,850.00</span>
              </div>
            </div>
            <div class="settlement-icon">
              <text class="icon-wallet">💰</text>
            </div>
          </div>
          <div class="settlement-divider" />
          <div class="settlement-bottom">
            <div class="settlement-item">
              <div class="item-label">
                工时费
              </div>
              <div class="item-value">
                ¥ 9,200
              </div>
            </div>
            <div class="settlement-item-divider" />
            <div class="settlement-item">
              <div class="item-label">
                奖励金
              </div>
              <div class="item-value">
                ¥ 3,650
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据看板 -->
      <!-- <div class="dashboard">
        <div class="data-card">
          <div class="icon-wrap success">
            <text>✓</text>
          </div>
          <div class="label">
            已结算{{ order_num }}
          </div>
          <div class="value">
            ¥ 45,200
          </div>
        </div>
        <div class="data-card">
          <div class="icon-wrap warning">
            <text>🕒</text>
          </div>
          <div class="label">
            待结算
          </div>
          <div class="value">
            ¥ 12,850
          </div>
        </div>
        <div class="data-card">
          <div class="icon-wrap primary">
            <text>🏆</text>
          </div>
          <div class="label">
            本月奖励
          </div>
          <div class="value">
            ¥ 3,650
          </div>
        </div>
        <div class="data-card">
          <div class="icon-wrap purple">
            <text>📈</text>
          </div>
          <div class="label">
            环比增长
          </div>
          <div class="value up">
            +12.5%
          </div>
        </div>
      </div> -->

      <!-- 订单管理 -->
      <div class="section">
        <div class="section-head">
          <span class="title">订单管理</span>
          <span class="more">查看全部</span>
        </div>

        <nut-tabs v-model="orderType">
          <nut-tab-pane title="待施工 (3)">
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
                        <!-- <span class="tag pending">待施工</span> -->
                      </div>
                      <div class="sn">
                        订单号：#36123217
                      </div>
                    </div>
                  </div>
                  <div class="price-wrap">
                    <div class="price">
                      ¥ 450.00
                    </div>
                    <div class="desc">
                      预计工时费
                    </div>
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
                  <nut-button block plain size="large">
                    联系客户
                  </nut-button>
                  <nut-button block custom-color="#1a1a2e" size="large">
                    开始施工 / 录入
                  </nut-button>
                </div>
              </div>
            </div>
          </nut-tab-pane>

          <nut-tab-pane title="施工中 (1)">
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
                        <!-- <span class="tag pending">待施工</span> -->
                      </div>
                      <div class="sn">
                        订单号：#36123217
                      </div>
                    </div>
                  </div>
                  <div class="price-wrap">
                    <div class="price">
                      ¥ 450.00
                    </div>
                    <div class="desc">
                      预计工时费
                    </div>
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
                  <nut-button block type="primary" size="large">
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
                    <div class="car-icon success">
                      <text>✓</text>
                    </div>
                    <div class="info">
                      <div class="name-wrap">
                        <span class="name">宝马 5系 2022款</span>
                        <span class="tag done">已完成</span>
                      </div>
                      <div class="sn">
                        订单号：#36123215
                      </div>
                    </div>
                  </div>
                  <div class="price-info">
                    <div class="symbol">
                      ¥
                    </div>
                    <div class="amount">
                      680.00
                    </div>
                    <div class="status">
                      已结算
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="time">完工时间：10:30 AM</span>
                  <span class="more-link">查看详情</span>
                </div>
              </div>
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
                <div class="time">
                  申请时间：2023-12-20 09:15
                </div>
                <div class="desc-box">
                  <text class="label">问题描述：</text>
                  <text class="content">
                    客户反馈洗车后发现左前门把手处有细微划痕，请核实施工前照片。
                  </text>
                </div>
                <div class="actions">
                  <span class="btn-text">驳回</span>
                  <nut-button type="warning">
                    处理售后
                  </nut-button>
                </div>
              </div>
            </div>
          </nut-tab-pane>
        </nut-tabs>
      </div>
    </div>
  </AppContainer>
</template>

<style lang="scss" scoped>
.store {
  ::v-deep() {
    .nut-tab-pane {
      padding: 0 !important;
      background: transparent !important;
    }
  }

  // 结算概览卡片
  .settlement-card {
    padding: 36rpx;
    margin-top: 20rpx;
    background: linear-gradient(135deg, #4ade80, #16a34a);
    border-radius: 24rpx;

    .settlement-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .settlement-info {
        .settlement-label {
          margin-bottom: 16rpx;
          font-size: 26rpx;
          color: rgb(255 255 255 / 80%);
        }

        .settlement-amount {
          display: flex;
          gap: 8rpx;
          align-items: baseline;

          .currency {
            font-size: 32rpx;
            font-weight: 600;
            color: #fff;
          }

          .amount {
            font-size: 64rpx;
            font-weight: 700;
            line-height: 1;
            color: #fff;
          }
        }
      }

      .settlement-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 88rpx;
        height: 88rpx;
        font-size: 44rpx;
        background: rgb(255 255 255 / 20%);
        border-radius: 20rpx;
      }
    }

    .settlement-divider {
      height: 1rpx;
      margin: 32rpx 0;
      background: rgb(255 255 255 / 25%);
    }

    .settlement-bottom {
      display: flex;
      align-items: center;

      .settlement-item {
        flex: 1;

        .item-label {
          margin-bottom: 8rpx;
          font-size: 24rpx;
          color: rgb(255 255 255 / 75%);
        }

        .item-value {
          font-size: 32rpx;
          font-weight: 600;
          color: #fff;
        }
      }

      .settlement-item-divider {
        width: 1rpx;
        height: 60rpx;
        margin: 0 32rpx;
        background: rgb(255 255 255 / 25%);
      }
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

    .tabs {
      display: flex;
      gap: 40rpx;
      margin-bottom: 32rpx;
      border-bottom: 2rpx solid #f0f0f0;

      .tab {
        position: relative;
        padding-bottom: 16rpx;
        font-size: 28rpx;
        color: #999;

        &.active {
          font-weight: 600;
          color: #1a1a2e;

          &::after {
            position: absolute;
            right: 0;
            bottom: -2rpx;
            left: 0;
            height: 4rpx;
            content: '';
            background: #22c55e;
            border-radius: 2rpx;
          }
        }
      }
    }

    .order-list {
      display: flex;
      flex-direction: column;
      gap: 24rpx;

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
              color: #666;
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
          }
        }
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
