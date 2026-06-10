<template>
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
          <span
            v-if="type == 2"
            class="status-tag"
            :class="[data?.hour_price_settle == 0 ? 'pending' : 'settled']"
          >
            {{ data?.hour_price_settle == 0 ? '待结算' : '已结算' }}
          </span>
        </div>
        <div class="fee-sep" />
        <div class="fee-item">
          <span class="fee-label">奖励金</span>
          <span class="fee-value">¥{{ data?.reward_price }}</span>
          <span
            v-if="type == 2"
            class="status-tag"
            :class="[data?.reward_price_settle == 0 ? 'pending' : 'settled']"
          >
            {{ data?.reward_price_settle == 0 ? '待结算' : '已结算' }}
          </span>
        </div>
      </div>
      <div class="order-row">
        <span>订单号：{{ data?.order_sn }}</span>
        <span class="ml-1 text-[var(--uvt-primary-color)]" @click="copy(data?.order_sn!)">
          复制
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { copy } from '@/utils/uni'

interface IProps {
  data?: Partial<IOrderItem>
  type?: string | number
}
withDefaults(defineProps<IProps>(), {
  type: 1,
  data: () => ({}),
})
</script>
