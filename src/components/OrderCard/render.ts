import { h } from 'vue'
import { copy } from '@/utils/uni'

export function renderOrderCard(row: any) {
  if (!row?.id) return null

  return h(
    'div',
    {
      class: 'order-card',
      style: 'padding: 30rpx; background: #fff; border-radius: 24rpx; margin: 20rpx 0;',
    },
    [
      // debug
      h(
        'div',
        { style: 'color: red; font-size: 24rpx; margin-bottom: 10rpx;' },
        `debug: ${row.id}`,
      ),
      // 顶部
      h(
        'div',
        {
          style:
            'display: flex; justify-content: space-between; font-size: 32rpx; font-weight: bold;',
        },
        [
          h('span', {}, row.service_name),
          h('span', { style: 'color: #22c55e;' }, `¥ ${row.total_amount}`),
        ],
      ),
      h(
        'div',
        { style: 'display: flex; justify-content: space-between; margin-top: 10rpx; color: #666;' },
        [h('span', {}, row.vehicle_type), h('span', {}, '总费用')],
      ),
      // 分隔线
      h('div', { style: 'height: 1rpx; background: #eee; margin: 20rpx 0;' }),
      // 底部
      h('div', { style: 'display: flex; gap: 40rpx; margin-bottom: 20rpx;' }, [
        h('span', {}, `工时费 ¥${row.hour_price}`),
        h('span', {}, `奖励金 ¥${row.reward_price}`),
      ]),
      h('div', { style: 'font-size: 24rpx; color: #999;' }, [
        h('span', {}, `订单号：${row.order_sn}`),
        h(
          'span',
          {
            style: 'color: #22c55e; margin-left: 10rpx;',
            onClick: () => copy(row.order_sn),
          },
          '复制',
        ),
      ]),
    ],
  )
}
