<template>
  <app-container>
    <div class="settlement-page">
      <!-- 顶部月份选择器 -->
      <div class="month-bar">
        <div class="month-arrow" @tap="prevMonth">
          <text class="arrow-icon">‹</text>
        </div>
        <div class="month-label">
          <text class="month-text">{{ monthLabel }}</text>
          <text v-if="isCurrentMonth" class="month-tag">本月</text>
        </div>
        <div class="month-arrow" :class="{ disabled: isCurrentMonth }" @tap="nextMonth">
          <text class="arrow-icon">›</text>
        </div>
      </div>

      <!-- 汇总卡片 -->
      <Summary />

      <!-- 明细列表 -->
      <div class="detail-section">
        <div class="section-header">
          <span class="section-title">结算明细</span>
          <span class="section-count">共 {{ list.length }} 条</span>
        </div>

        <!-- 空状态 -->
        <div v-if="list.length === 0" class="empty-state">
          <text class="empty-icon">📭</text>
          <div class="empty-text">本月暂无结算记录</div>
        </div>

        <!-- 明细卡片列表 -->
        <div v-else class="detail-list">
          <div v-for="item in list" :key="item.id" class="detail-card">
            <!-- 卡片顶部 -->
            <div class="card-top">
              <div class="card-left">
                <div class="service-name">{{ item.serviceName }}</div>
                <div class="car-info">
                  <text class="car-icon-text">🚗</text>
                  <span>{{ item.carInfo }}</span>
                </div>
              </div>
              <div class="card-right">
                <div class="total-price">¥ {{ formatAmount(item.workFee + item.rewardFee) }}</div>
                <div class="status-tag" :class="[item.status]">
                  {{ item.status === 'settled' ? '已结算' : '待结算' }}
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
                  <span class="fee-value">¥ {{ formatAmount(item.workFee) }}</span>
                </div>
                <div class="fee-sep" />
                <div class="fee-item">
                  <span class="fee-label">奖励金</span>
                  <span class="fee-value reward">¥ {{ formatAmount(item.rewardFee) }}</span>
                </div>
              </div>
              <div class="order-row">
                <span class="order-no">{{ item.orderNo }}</span>
                <span class="order-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface SettlementItem {
  id: string
  orderNo: string
  serviceName: string
  carInfo: string
  date: string
  workFee: number
  rewardFee: number
  status: 'settled' | 'pending'
}

const today = dayjs()
const currentYear = ref(today.year())
const currentMonth = ref(today.month() + 1)

const allData: Record<string, SettlementItem[]> = {
  '2026-3': [
    {
      id: '1',
      orderNo: '#36124301',
      serviceName: '全车精洗 + 镀晶',
      carInfo: '奔驰 E300 2023款',
      date: '03-18',
      workFee: 680,
      rewardFee: 120,
      status: 'pending',
    },
    {
      id: '2',
      orderNo: '#36124298',
      serviceName: '漆面修复 + 打蜡',
      carInfo: '宝马 5系 2022款',
      date: '03-15',
      workFee: 520,
      rewardFee: 80,
      status: 'pending',
    },
    {
      id: '3',
      orderNo: '#36124265',
      serviceName: '内饰深度清洁',
      carInfo: '奥迪 A6L 2021款',
      date: '03-12',
      workFee: 380,
      rewardFee: 50,
      status: 'settled',
    },
    {
      id: '4',
      orderNo: '#36124240',
      serviceName: '全车贴膜',
      carInfo: '特斯拉 Model 3',
      date: '03-09',
      workFee: 1200,
      rewardFee: 200,
      status: 'settled',
    },
    {
      id: '5',
      orderNo: '#36124218',
      serviceName: '底盘装甲 + 清洗',
      carInfo: '丰田 凯美瑞 2022款',
      date: '03-05',
      workFee: 460,
      rewardFee: 60,
      status: 'settled',
    },
    {
      id: '6',
      orderNo: '#36124192',
      serviceName: '轮毂翻新',
      carInfo: '本田 雅阁 2023款',
      date: '03-02',
      workFee: 320,
      rewardFee: 40,
      status: 'settled',
    },
  ],
  '2026-2': [
    {
      id: '7',
      orderNo: '#36124101',
      serviceName: '全车精洗 + 打蜡',
      carInfo: '日产 天籁 2022款',
      date: '02-26',
      workFee: 450,
      rewardFee: 70,
      status: 'settled',
    },
    {
      id: '8',
      orderNo: '#36124088',
      serviceName: '漆面抛光处理',
      carInfo: '马自达 CX-5',
      date: '02-22',
      workFee: 580,
      rewardFee: 100,
      status: 'settled',
    },
    {
      id: '9',
      orderNo: '#36124065',
      serviceName: '内饰清洁 + 除味',
      carInfo: '大众 帕萨特 2021款',
      date: '02-18',
      workFee: 350,
      rewardFee: 45,
      status: 'settled',
    },
    {
      id: '10',
      orderNo: '#36124042',
      serviceName: '全车贴膜隐形车衣',
      carInfo: '路虎 揽胜运动版',
      date: '02-14',
      workFee: 1800,
      rewardFee: 300,
      status: 'settled',
    },
    {
      id: '11',
      orderNo: '#36124021',
      serviceName: '底盘清洗 + 防锈',
      carInfo: '福特 蒙迪欧',
      date: '02-08',
      workFee: 280,
      rewardFee: 30,
      status: 'settled',
    },
  ],
  '2026-1': [
    {
      id: '12',
      orderNo: '#36123998',
      serviceName: '新车开蜡 + 镀晶',
      carInfo: '保时捷 Cayenne',
      date: '01-28',
      workFee: 1500,
      rewardFee: 250,
      status: 'settled',
    },
    {
      id: '13',
      orderNo: '#36123975',
      serviceName: '全车精洗',
      carInfo: '雷克萨斯 ES300h',
      date: '01-22',
      workFee: 420,
      rewardFee: 60,
      status: 'settled',
    },
    {
      id: '14',
      orderNo: '#36123952',
      serviceName: '轮胎翻新 + 轮毂美容',
      carInfo: '奥迪 Q7 2023款',
      date: '01-16',
      workFee: 680,
      rewardFee: 90,
      status: 'settled',
    },
  ],
}

const currentKey = computed(() => `${currentYear.value}-${currentMonth.value}`)
const list = computed(() => allData[currentKey.value] ?? [])

const monthLabel = computed(() => `${currentYear.value} 年 ${currentMonth.value} 月`)

function prevMonth() {
  const prev = dayjs()
    .year(currentYear.value)
    .month(currentMonth.value - 1)
    .subtract(1, 'month')
  currentYear.value = prev.year()
  currentMonth.value = prev.month() + 1
}

function nextMonth() {
  const current = dayjs()
    .year(currentYear.value)
    .month(currentMonth.value - 1)
  if (current.isSame(today, 'month')) {
    return
  }
  const next = current.add(1, 'month')
  currentYear.value = next.year()
  currentMonth.value = next.month() + 1
}

const isCurrentMonth = computed(() => {
  return dayjs()
    .year(currentYear.value)
    .month(currentMonth.value - 1)
    .isSame(today, 'month')
})

function formatAmount(val: number) {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style lang="scss" scoped>
.settlement-page {
  background: var(--uvt-primary-bg-color);
  padding: 0 32rpx;
  padding-bottom: 48rpx;
  display: flex;
  flex-direction: column;
  row-gap: 30rpx;
}

// 月份切换栏
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

    .arrow-icon {
      font-size: 40rpx;
      font-weight: 300;
      line-height: 1;
      color: #1a1a2e;
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
      letter-spacing: 1rpx;
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

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96rpx 0;

  .empty-icon {
    margin-bottom: 24rpx;
    font-size: 80rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #9ca3af;
  }
}

// 明细卡片列表
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

// 明细卡片
.detail-card {
  padding: 32rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgb(0 0 0 / 3%);

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .card-left {
      flex: 1;
      margin-right: 24rpx;

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
          color: #f97316;
          background: #fff7ed;
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
          color: #374151;

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
      justify-content: space-between;

      .order-no {
        font-size: 24rpx;
        color: #9ca3af;
      }

      .order-date {
        font-size: 24rpx;
        color: #9ca3af;
      }
    }
  }
}
</style>
