<template>
  <AppContainer>
    <div class="invoice-page">
      <MonthSwitcher v-model="currentMonth" />
      <!-- 统计卡片 -->
      <div class="stats-row">
        <div class="stat-card uninvoiced">
          <div class="stat-label">未开票金额</div>
          <div class="stat-amount">¥ {{ formatAmount(uninvoicedTotal) }}</div>
          <div class="stat-sub">{{ uninvoicedList.length }} 单待开票</div>
        </div>
        <div class="stat-card invoiced">
          <div class="stat-label">已开票金额</div>
          <div class="stat-amount">¥ {{ formatAmount(invoicedTotal) }}</div>
          <div class="stat-sub">{{ invoicedList.length }} 单已开票</div>
        </div>
      </div>

      <nut-tabs v-model="invoiceTabType">
        <nut-tab-pane title="未开票" :pane-key="0">
          <div class="order-wrap">
            <div v-if="uninvoicedList.length === 0" class="empty-state">
              <text class="empty-icon">🎉</text>
              <div class="empty-text">本月所有订单均已开票</div>
            </div>
            <div v-else>
              <!-- 全选 -->
              <div class="mb-[20rpx]">
                <nut-checkbox
                  v-model="selectedAll"
                  :indeterminate="indeterminate"
                  @change="toggleSelectAll"
                >
                  <div class="flex items-center justify-between">
                    <span>全选</span>
                    <span class="text-[var(--uvt-primary-color)]">
                      已选 {{ selectedIds.length }} 单
                    </span>
                  </div>
                </nut-checkbox>
              </div>

              <nut-checkbox-group ref="groupEl" v-model="selectedIds" @change="onGroupChange">
                <div class="order-list">
                  <div v-for="order in uninvoicedList" :key="order.id" class="order-card">
                    <nut-checkbox :label="order.id">
                      <div class="card-body">
                        <div class="order-top">
                          <span class="service-name">{{ order.serviceName }}</span>
                          <span class="order-total">
                            ¥ {{ formatAmount(order.workFee + order.rewardFee) }}
                          </span>
                        </div>
                        <div class="order-mid">
                          <text class="car-emoji">🚗</text>
                          <span class="car-info">{{ order.carInfo }}</span>
                        </div>
                        <div class="order-bottom">
                          <span class="order-no">{{ order.orderNo }}</span>
                          <div class="fee-tags">
                            <span class="fee-tag">工时 ¥{{ formatAmount(order.workFee) }}</span>
                            <span class="fee-tag reward"
                              >奖励 ¥{{ formatAmount(order.rewardFee) }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </nut-checkbox>
                  </div>
                </div>
              </nut-checkbox-group>
            </div>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="已开票" :pane-key="1">
          <div class="order-wrap">
            <div v-if="invoicedList.length === 0" class="empty-state">
              <text class="empty-icon">📭</text>
              <div class="empty-text">本月暂无已开票记录</div>
            </div>
            <div v-else class="order-list">
              <div v-for="order in invoicedList" :key="order.id" class="order-card invoiced-card">
                <div class="card-body">
                  <div class="order-top">
                    <span class="service-name">{{ order.serviceName }}</span>
                    <span class="order-total"
                      >¥ {{ formatAmount(order.workFee + order.rewardFee) }}</span
                    >
                  </div>
                  <div class="order-mid">
                    <text class="car-emoji">🚗</text>
                    <span class="car-info">{{ order.carInfo }}</span>
                  </div>
                  <div class="invoice-info-row">
                    <div class="invoice-no-wrap">
                      <text class="invoice-icon">🧾</text>
                      <span class="invoice-no">发票号：{{ order.invoiceNo }}</span>
                    </div>
                    <span class="invoiced-tag">已开票</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="已确认" :pane-key="2">
          <div class="order-wrap">
            <div v-if="invoicedList.length === 0" class="empty-state">
              <text class="empty-icon">📭</text>
              <div class="empty-text">本月暂无已开票记录</div>
            </div>
            <div v-else class="order-list">
              <div v-for="order in invoicedList" :key="order.id" class="order-card invoiced-card">
                <div class="card-body">
                  <div class="order-top">
                    <span class="service-name">{{ order.serviceName }}</span>
                    <span class="order-total"
                      >¥ {{ formatAmount(order.workFee + order.rewardFee) }}</span
                    >
                  </div>
                  <div class="order-mid">
                    <text class="car-emoji">🚗</text>
                    <span class="car-info">{{ order.carInfo }}</span>
                  </div>
                  <div class="invoice-info-row">
                    <div class="invoice-no-wrap">
                      <text class="invoice-icon">🧾</text>
                      <span class="invoice-no">发票号：{{ order.invoiceNo }}</span>
                    </div>
                    <span class="invoiced-tag">已确认</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="已驳回" :pane-key="3">
          <div class="order-wrap">
            <div v-if="invoicedList.length === 0" class="empty-state">
              <text class="empty-icon">📭</text>
              <div class="empty-text">本月暂无已开票记录</div>
            </div>
            <div v-else class="order-list">
              <div v-for="order in invoicedList" :key="order.id" class="order-card invoiced-card">
                <div class="card-body">
                  <div class="order-top">
                    <span class="service-name">{{ order.serviceName }}</span>
                    <span class="order-total"
                      >¥ {{ formatAmount(order.workFee + order.rewardFee) }}</span
                    >
                  </div>
                  <div class="order-mid">
                    <text class="car-emoji">🚗</text>
                    <span class="car-info">{{ order.carInfo }}</span>
                  </div>
                  <div class="invoice-info-row">
                    <div class="invoice-no-wrap">
                      <text class="invoice-icon">🧾</text>
                      <span class="invoice-no">发票号：{{ order.invoiceNo }}</span>
                    </div>
                    <span class="invoiced-tag">重新提交</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nut-tab-pane>
      </nut-tabs>
    </div>

    <!-- 底部开票栏 -->
    <div v-if="selectedIds.length > 0" class="invoice-bar">
      <div class="invoice-bar-info">
        <span class="bar-label">已选 {{ selectedIds.length }} 单</span>
        <!-- <span class="bar-label">已选 {{ selectedIds.length }} 单，合计</span>
        <span class="bar-amount">¥ {{ formatAmount(selectedTotal) }}</span> -->
      </div>
      <nut-button
        type="primary"
        custom-color="linear-gradient(135deg, #22c55e, #16a34a)"
        @tap="openInvoicePopup"
      >
        开具发票
      </nut-button>
    </div>

    <!-- 开票弹窗 -->
    <nut-popup v-model:visible="invoicePopupVisible" round safe-area-inset-bottom position="bottom">
      <div class="invoice-popup">
        <div class="popup-header">
          <span class="popup-title">开具发票</span>
        </div>

        <!-- 开票金额 -->
        <div class="popup-amount-card">
          <div class="amount-label">本次需开票金额</div>
          <div class="amount-value">
            <span class="amount-symbol">¥</span>
            <span class="amount-num">{{ formatAmount(selectedTotal) }}</span>
          </div>
          <div class="amount-sub">共 {{ selectedIds.length }} 笔订单</div>
        </div>

        <!-- 我方开票信息 -->
        <div class="popup-section">
          <div class="popup-section-title">我方开票信息</div>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">公司名称</span>
              <span class="info-value">广州轩科汽车服务有限公司</span>
            </div>
            <div class="info-row">
              <span class="info-label">纳税人识别号</span>
              <span class="info-value mono">91440101MA9XXXXXX</span>
            </div>
            <div class="info-row">
              <span class="info-label">开户银行</span>
              <span class="info-value">中国工商银行广州分行</span>
            </div>
            <div class="info-row">
              <span class="info-label">银行账号</span>
              <span class="info-value mono">3602 0200 0900 XXXX</span>
            </div>
            <div class="info-row">
              <span class="info-label">注册地址</span>
              <span class="info-value">广州市天河区XXX路XXX号</span>
            </div>
            <div class="info-row">
              <span class="info-label">联系电话</span>
              <span class="info-value">020-XXXX-XXXX</span>
            </div>
          </div>
          <div class="copy-tip" @tap="copyBillingInfo">
            <text class="tip-icon">📋</text>
            <span>点击复制开票信息</span>
          </div>
        </div>

        <!-- 回填发票信息 -->
        <div class="popup-section">
          <div class="popup-section-title">
            回填发票凭证
            <span class="optional-tag">开完票后填写</span>
          </div>

          <!-- 发票号码 -->
          <div class="input-wrap">
            <div class="input-label">发票号码</div>
            <input
              v-model="invoiceNo"
              class="invoice-input"
              type="text"
              placeholder="请输入发票号码（如：01234567）"
              placeholder-class="input-placeholder"
            />
          </div>

          <!-- 上传发票截图 -->
          <div class="upload-wrap">
            <div class="input-label">发票截图</div>
            <div class="upload-area" @tap="uploadInvoicePhoto">
              <div v-if="invoicePhoto" class="upload-preview">
                <image class="preview-img" mode="aspectFill" :src="invoicePhoto" />
                <div class="preview-delete" @tap.stop="invoicePhoto = ''">
                  <text>✕</text>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <text class="upload-icon">📸</text>
                <span class="upload-text">上传发票截图</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="popup-actions">
          <nut-button plain @tap="invoicePopupVisible = false">暂不提交</nut-button>
          <nut-button
            type="primary"
            custom-color="linear-gradient(135deg, #22c55e, #16a34a)"
            :disabled="!invoiceNo && !invoicePhoto"
            @tap="submitInvoice"
          >
            确认提交
          </nut-button>
        </div>
      </div>
    </nut-popup>
  </AppContainer>
</template>

<script setup lang="ts">
interface Order {
  id: string
  orderNo: string
  serviceName: string
  carInfo: string
  workFee: number
  rewardFee: number
  invoiced: boolean
  invoiceNo?: string
}
const invoiceTabType = ref(0),
  selectedIds = ref<string[]>([]),
  groupEl = ref(),
  selectedAll = ref(false),
  indeterminate = ref(false)

const invoicePopupVisible = ref(false)
const invoiceNo = ref('')
const invoicePhoto = ref('')

const allOrders = reactive<Record<string, Order[]>>({
  '2026-3': [
    {
      id: '1',
      orderNo: '#36124301',
      serviceName: '全车精洗 + 镀晶',
      carInfo: '奔驰 E300 2023款',
      workFee: 680,
      rewardFee: 120,
      invoiced: false,
    },
    {
      id: '2',
      orderNo: '#36124298',
      serviceName: '漆面修复 + 打蜡',
      carInfo: '宝马 5系 2022款',
      workFee: 520,
      rewardFee: 80,
      invoiced: false,
    },
    {
      id: '3',
      orderNo: '#36124265',
      serviceName: '内饰深度清洁',
      carInfo: '奥迪 A6L 2021款',
      workFee: 380,
      rewardFee: 50,
      invoiced: true,
      invoiceNo: '02234891',
    },
    {
      id: '4',
      orderNo: '#36124240',
      serviceName: '全车贴膜',
      carInfo: '特斯拉 Model 3',
      workFee: 1200,
      rewardFee: 200,
      invoiced: true,
      invoiceNo: '02234890',
    },
    {
      id: '5',
      orderNo: '#36124218',
      serviceName: '底盘装甲 + 清洗',
      carInfo: '丰田 凯美瑞 2022款',
      workFee: 460,
      rewardFee: 60,
      invoiced: false,
    },
    {
      id: '6',
      orderNo: '#36124218',
      serviceName: '底盘装甲 + 清洗',
      carInfo: '丰田 凯美瑞 2022款',
      workFee: 460,
      rewardFee: 60,
      invoiced: false,
    },
    {
      id: '7',
      orderNo: '#36124218',
      serviceName: '底盘装甲 + 清洗',
      carInfo: '丰田 凯美瑞 2022款',
      workFee: 460,
      rewardFee: 60,
      invoiced: false,
    },
  ],
  '2026-2': [
    {
      id: '6',
      orderNo: '#36124101',
      serviceName: '全车精洗 + 打蜡',
      carInfo: '日产 天籁 2022款',
      workFee: 450,
      rewardFee: 70,
      invoiced: true,
      invoiceNo: '02234855',
    },
    {
      id: '7',
      orderNo: '#36124088',
      serviceName: '漆面抛光处理',
      carInfo: '马自达 CX-5',
      workFee: 580,
      rewardFee: 100,
      invoiced: false,
    },
    {
      id: '8',
      orderNo: '#36124065',
      serviceName: '内饰清洁 + 除味',
      carInfo: '大众 帕萨特 2021款',
      workFee: 350,
      rewardFee: 45,
      invoiced: false,
    },
  ],
})

const currentMonth = ref()
const currentOrders = computed(() => allOrders[currentMonth.value] ?? [])

const uninvoicedList = computed(() => currentOrders.value.filter((o) => !o.invoiced))
const invoicedList = computed(() => currentOrders.value.filter((o) => o.invoiced))

const uninvoicedTotal = computed(() =>
  uninvoicedList.value.reduce((s, o) => s + o.workFee + o.rewardFee, 0),
)
const invoicedTotal = computed(() =>
  invoicedList.value.reduce((s, o) => s + o.workFee + o.rewardFee, 0),
)

const selectedTotal = computed(() =>
  uninvoicedList.value
    .filter((o) => selectedIds.value.includes(o.id))
    .reduce((s, o) => s + o.workFee + o.rewardFee, 0),
)

function toggleSelectAll(checked: boolean) {
  groupEl.value.toggleAll(checked)
}

function onGroupChange(values: any[]) {
  if (values.length >= uninvoicedList.value.length) {
    indeterminate.value = false
    selectedAll.value = true
  } else if (values.length > 0) {
    indeterminate.value = true
  } else {
    indeterminate.value = false
    selectedAll.value = false
  }
}

function openInvoicePopup() {
  invoiceNo.value = ''
  invoicePhoto.value = ''
  invoicePopupVisible.value = true
}

function uploadInvoicePhoto() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success(res) {
      invoicePhoto.value = res.tempFilePaths[0]
    },
  })
}

function copyBillingInfo() {
  uni.setClipboardData({
    data: '公司名称：广州轩科汽车服务有限公司\n纳税人识别号：91440101MA9XXXXXX\n开户银行：中国工商银行广州分行\n银行账号：3602 0200 0900 XXXX',
    success() {
      uni.showToast({ title: '开票信息已复制', icon: 'success' })
    },
  })
}

function submitInvoice() {
  // 标记已选订单为已开票
  const orders = allOrders[currentMonth.value]
  if (orders) {
    selectedIds.value.forEach((id) => {
      const order = orders.find((o) => o.id === id)
      if (order) {
        order.invoiced = true
        order.invoiceNo = invoiceNo.value || '待确认'
      }
    })
  }
  selectedIds.value = []
  invoicePopupVisible.value = false
  uni.showToast({ title: '发票凭证已提交', icon: 'success' })
}

function formatAmount(val: number) {
  return val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style lang="scss" scoped>
.invoice-page {
  padding-bottom: 160rpx;
  background: var(--uvt-primary-bg-color);

  ::v-deep() {
    .nut-checkbox {
      width: 100%;
      margin-right: 0;
    }

    .nut-tab-pane {
      padding: 0 !important;
      margin-top: 20rpx;
      background: transparent !important;
    }
  }
}

// 统计卡片
.stats-row {
  display: flex;
  gap: 20rpx;
  padding: 0 32rpx;

  .stat-card {
    flex: 1;
    display: flex;
    gap: 16rpx;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding: 28rpx 24rpx;
    border-radius: 20rpx;

    &.uninvoiced {
      background: linear-gradient(135deg, #fff7ed, #ffedd5);

      .stat-amount {
        color: #f97316;
      }
    }

    &.invoiced {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);

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

.order-wrap {
  padding: 0 32rpx;

  // 订单列表
  .order-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
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
        margin-bottom: 12rpx;

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
        margin-bottom: 16rpx;

        .car-emoji {
          font-size: 24rpx;
        }

        .car-info {
          font-size: 26rpx;
          color: #6b7280;
        }
      }

      .order-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .order-no {
          font-size: 24rpx;
          color: #9ca3af;
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
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;

  .empty-icon {
    margin-bottom: 24rpx;
    font-size: 80rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #9ca3af;
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

  .invoice-bar-info {
    .bar-label {
      display: block;
      margin-bottom: 4rpx;
      font-size: 24rpx;
      color: #6b7280;
    }

    .bar-amount {
      font-size: 36rpx;
      font-weight: 700;
      color: #1a1a2e;
    }
  }
}

// 开票弹窗
.invoice-popup {
  padding: 32rpx;
  height: 80vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  row-gap: 30rpx;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid #f0f2f5;

    .popup-title {
      font-size: 36rpx;
      font-weight: 700;
      color: #1a1a2e;
    }

    .popup-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56rpx;
      height: 56rpx;
      font-size: 28rpx;
      color: #9ca3af;
      background: #f5f6fa;
      border-radius: 50%;
    }
  }

  // 金额卡片
  .popup-amount-card {
    text-align: center;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 20rpx;

    .amount-label {
      margin-bottom: 12rpx;
      font-size: 26rpx;
      color: rgb(255 255 255 / 80%);
    }

    .amount-value {
      display: flex;
      gap: 8rpx;
      align-items: baseline;
      justify-content: center;
      margin-bottom: 8rpx;

      .amount-symbol {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }

      .amount-num {
        font-size: 72rpx;
        font-weight: 700;
        line-height: 1;
        color: #fff;
      }
    }

    .amount-sub {
      font-size: 24rpx;
      color: rgb(255 255 255 / 70%);
    }
  }

  // 弹窗分区
  .popup-section {
    .popup-section-title {
      display: flex;
      gap: 10rpx;
      align-items: center;
      margin-bottom: 20rpx;
      font-size: 30rpx;
      font-weight: 700;
      color: #1a1a2e;

      .section-icon {
        font-size: 30rpx;
      }

      .optional-tag {
        padding: 4rpx 12rpx;
        margin-left: 8rpx;
        font-size: 22rpx;
        font-weight: 400;
        color: #9ca3af;
        background: #f0f2f5;
        border-radius: 8rpx;
      }
    }

    .info-card {
      padding: 4rpx 0;
      background: #f8fafc;
      border-radius: 16rpx;
      overflow: hidden;

      .info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 24rpx;
        border-bottom: 1rpx solid #f0f2f5;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 26rpx;
          color: #9ca3af;
          flex-shrink: 0;
          margin-right: 20rpx;
        }

        .info-value {
          font-size: 26rpx;
          font-weight: 500;
          color: #374151;
          text-align: right;

          &.mono {
            font-family: monospace;
            letter-spacing: 2rpx;
          }
        }
      }
    }

    .copy-tip {
      display: flex;
      gap: 8rpx;
      align-items: center;
      justify-content: center;
      padding: 16rpx;
      margin-top: 16rpx;
      font-size: 26rpx;
      color: #22c55e;
      background: #f0fdf4;
      border-radius: 12rpx;

      .tip-icon {
        font-size: 26rpx;
      }
    }

    // 输入框
    .input-wrap {
      margin-bottom: 24rpx;

      .input-label {
        margin-bottom: 12rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: #374151;
      }

      .invoice-input {
        width: 100%;
        height: 88rpx;
        padding: 0 24rpx;
        font-size: 28rpx;
        color: #1a1a2e;
        background: #f8fafc;
        border: 2rpx solid #e5e7eb;
        border-radius: 16rpx;
        box-sizing: border-box;

        &:focus {
          border-color: #22c55e;
        }
      }
    }

    // 上传区
    .upload-wrap {
      .input-label {
        margin-bottom: 12rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: #374151;
      }

      .upload-area {
        overflow: hidden;
        border-radius: 16rpx;

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          gap: 12rpx;
          align-items: center;
          justify-content: center;
          height: 180rpx;
          background: #f8fafc;
          border: 2rpx dashed #d1d5db;
          border-radius: 16rpx;

          .upload-icon {
            font-size: 56rpx;
          }

          .upload-text {
            font-size: 28rpx;
            color: #9ca3af;
          }
        }

        .upload-preview {
          position: relative;
          height: 180rpx;

          .preview-img {
            width: 100%;
            height: 100%;
            border-radius: 16rpx;
          }

          .preview-delete {
            position: absolute;
            top: 12rpx;
            right: 12rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48rpx;
            height: 48rpx;
            font-size: 22rpx;
            color: #fff;
            background: rgb(0 0 0 / 50%);
            border-radius: 50%;
          }
        }
      }
    }
  }

  // 弹窗按钮
  .popup-actions {
    display: flex;
    gap: 20rpx;
  }
}
</style>
