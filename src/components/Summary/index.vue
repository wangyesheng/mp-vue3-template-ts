<template>
  <div class="summary-card">
    <div class="summary-bg-circle" />
    <div class="summary-top">
      <div class="summary-left">
        <div class="summary-label">2026-03结算总额</div>
        <div class="summary-amount">
          <span class="currency">¥</span>
          <span class="amount">12345.00</span>
        </div>
        <div class="summary-stats">
          <span class="stat-item"> <span class="dot settled" />已结算 10 单 </span>
          <span class="stat-item pending-text"> <span class="dot pending" />待结算 2 单 </span>
        </div>
      </div>
      <div class="summary-icon">
        <text>📋</text>
      </div>
    </div>
    <div class="summary-divider" />
    <div class="summary-bottom">
      <div class="summary-item">
        <div class="item-icon work">
          <text>⚙️</text>
        </div>
        <div class="item-info">
          <div class="item-label">工时费</div>
          <div class="item-value">¥ 1000</div>
        </div>
      </div>
      <div class="summary-sep" />
      <div class="summary-item">
        <div class="item-icon reward">
          <text>🏆</text>
        </div>
        <div class="item-info">
          <div class="item-label">奖励金</div>
          <div class="item-value reward-val">¥ 200</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.summary-card {
  position: relative;
  padding: 40rpx 40rpx 36rpx;
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
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 32rpx;

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
        margin-bottom: 20rpx;

        .currency {
          font-size: 32rpx;
          font-weight: 600;
          color: #fff;
        }

        .amount {
          font-size: 68rpx;
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
    }
  }

  .summary-divider {
    height: 1rpx;
    margin-bottom: 32rpx;
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
        width: 72rpx;
        height: 72rpx;
        font-size: 36rpx;
        border-radius: 18rpx;

        &.work {
          background: rgb(255 255 255 / 15%);
        }

        &.reward {
          background: rgb(253 224 71 / 20%);
        }
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

          &.reward-val {
            color: #fde047;
          }
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
