<template>
  <div class="summary-card">
    <div class="summary-top">
      <div class="summary-left">
        <div class="summary-label">{{ data.current_month }} 结算总额</div>
        <div class="summary-amount">
          <span class="currency">¥</span>
          <span class="amount">{{ data.total_amount }}</span>
        </div>
        <!-- <div class="summary-stats">
          <span class="stat-item"> <span class="dot settled" />已结算 10 单 </span>
          <span class="stat-item pending-text"> <span class="dot pending" />待结算 2 单 </span>
        </div> -->
      </div>
      <div class="summary-icon">
        <!-- <text class="i-mdi-invoice-text-multiple-outline text-white"></text> -->
        <image src="@/static/images/money1.png"></image>
      </div>
    </div>
    <div class="summary-divider" />
    <div class="summary-bottom">
      <div class="summary-item">
        <!-- <div class="item-icon work">
          <text class="i-mdi-cog-outline text-white"></text>
        </div> -->
        <div class="item-info">
          <div class="item-label">工时费</div>
          <div class="item-value">¥ {{ data.hour_amount }}</div>
        </div>
      </div>
      <div class="summary-sep" />
      <div class="summary-item">
        <!-- <div class="item-icon">
          <text class="i-mdi-trophy-outline text-white"></text>
        </div> -->
        <div class="item-info reward">
          <div class="item-label">奖励金</div>
          <div class="item-value reward-val">¥ {{ data.reward_amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ISummaryProps {
  data?: Partial<ISummaryInfo>
}

const _props = withDefaults(defineProps<ISummaryProps>(), {
  data: () => ({}),
})
</script>

<style lang="scss" scoped>
.summary-card {
  position: relative;
  padding: 30rpx 40rpx;
  overflow: hidden;
  background: linear-gradient(140deg, #22c55e 0%, #16a34a 100%);
  border-radius: 28rpx;
  box-shadow: 0 12rpx 40rpx rgb(34 197 94 / 30%);

  .summary-bg-circle {
    position: absolute;
    top: -60rpx;
    right: -60rpx;
    width: 260rpx;
    height: 260rpx;
    pointer-events: none;
    background: rgb(255 255 255 / 8%);
    border-radius: 50%;
  }

  .summary-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .summary-left {
      .summary-label {
        margin-bottom: 12rpx;
        font-size: 26rpx;
        color: rgb(255 255 255 / 80%);
      }

      .summary-amount {
        display: flex;
        gap: 6rpx;
        align-items: baseline;

        .currency {
          font-size: 32rpx;
          font-weight: 600;
          color: #fff;
        }

        .amount {
          font-size: 60rpx;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          letter-spacing: -1rpx;
        }
      }

      .summary-stats {
        display: flex;
        gap: 24rpx;
        align-items: center;

        .stat-item {
          display: flex;
          gap: 8rpx;
          align-items: center;
          font-size: 24rpx;
          color: rgb(255 255 255 / 80%);

          &.pending-text {
            color: #fde047;
          }

          .dot {
            width: 12rpx;
            height: 12rpx;
            border-radius: 50%;

            &.settled {
              background: rgb(255 255 255 / 90%);
            }

            &.pending {
              background: #fde047;
            }
          }
        }
      }
    }

    .summary-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 96rpx;
      height: 96rpx;
      font-size: 48rpx;
      background: rgb(255 255 255 / 18%);
      border-radius: 24rpx;

      image {
        width: 64rpx;
        height: 64rpx;
      }
    }
  }

  .summary-divider {
    height: 1rpx;
    margin: 32rpx 0;
    background: rgb(255 255 255 / 20%);
  }

  .summary-bottom {
    display: flex;
    align-items: center;

    .summary-item {
      display: flex;
      flex: 1;
      gap: 16rpx;
      align-items: center;

      &:first-child {
        justify-content: flex-start;
      }

      &:last-child {
        justify-content: flex-end;
      }

      .item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60rpx;
        height: 60rpx;
        font-size: 36rpx;
        border-radius: 18rpx;
        background: rgb(255 255 255 / 15%);
      }

      .item-info {
        .item-label {
          margin-bottom: 6rpx;
          font-size: 24rpx;
          color: rgb(255 255 255 / 75%);
        }

        .item-value {
          font-size: 32rpx;
          font-weight: 700;
          color: #fff;
        }

        &.reward {
          text-align: right;
        }
      }
    }

    .summary-sep {
      width: 1rpx;
      height: 72rpx;
      margin: 0 32rpx;
      background: rgb(255 255 255 / 20%);
    }
  }
}
</style>
