<template>
  <app-container>
    <div class="timeline">
      <nut-cell-group>
        <template #title>
          <span class="__title px-3 !text-sm">售后详情</span>
        </template>
        <nut-cell title="问题描述" :desc="afterSaleInfo.problem_desc"></nut-cell>
        <nut-cell title="问题图片">
          <template #desc>
            <div class="image-wrap">
              <div v-for="(url, index) in afterSaleInfo.images" :key="url" class="image-item">
                <image
                  mode="aspectFill"
                  :src="url"
                  @click="previewImage(index, afterSaleInfo.images!)"
                />
              </div>
            </div>
          </template>
        </nut-cell>
        <nut-cell title="联系人" :desc="afterSaleInfo.contact_name"></nut-cell>
        <nut-cell title="联系电话">
          <template #desc>
            <div class="flex items-center justify-end">
              <span>{{ afterSaleInfo.contact_phone }}</span>
              <span
                class="ml-1 text-[var(--uvt-primary-color)]"
                @click="callPhone(afterSaleInfo.contact_phone!)"
              >
                拨打
              </span>
            </div>
          </template>
        </nut-cell>
        <nut-cell title="申请时间" :desc="afterSaleInfo.createtime"></nut-cell>
      </nut-cell-group>

      <nut-cell-group>
        <template #title>
          <span class="__title px-3 !text-sm">售后进度</span>
        </template>
        <div class="p-4">
          <nut-steps direction="vertical" :current="steps.length">
            <nut-step
              v-for="step in steps"
              :key="step.id"
              :title="step.content"
              :content="step.createtime"
            />
          </nut-steps>
        </div>
      </nut-cell-group>
    </div>
    <div v-if="afterSaleInfo.handle_status != 2" class="footer">
      <div class="inner">
        <nut-button block custom-color="#1a1a2e" size="large" @click="onHandleAfterSale">
          {{ afterSaleInfo.handle_status == 0 ? '重新施工' : '确认完成' }}
        </nut-button>
      </div>
    </div>
  </app-container>
</template>

<script setup lang="ts">
import {
  completeHandleAfterSaleRes,
  getAfterSaleDetailRes,
  getAfterSaleTimelineRes,
  startHandleAfterSaleRes,
} from '@/api'
import { callPhone, previewImage } from '@/utils/uni'

let currentId: string | undefined
const steps = ref<IStepInfo[]>([]),
  afterSaleInfo = ref<Partial<IAfterSaleInfo>>({})

function onHandleAfterSale() {
  uni.showModal({
    title: '提示',
    content:
      afterSaleInfo.value.handle_status == 0 ? '确定要开始重新施工吗？' : '确定已施工完成吗？',
    async success({ confirm }) {
      if (confirm) {
        afterSaleInfo.value.handle_status == 0
          ? await startHandleAfterSaleRes(afterSaleInfo.value.id!)
          : await completeHandleAfterSaleRes(afterSaleInfo.value.id!)

        await getSaleInfo()
      }
    },
  })
}

async function getSaleInfo() {
  afterSaleInfo.value = await getAfterSaleDetailRes(currentId!)
  steps.value = await getAfterSaleTimelineRes(currentId!)
}

onLoad(async ({ id }: { id?: string } = {}) => {
  if (id) {
    currentId = id
    getSaleInfo()
  }
})
</script>

<style lang="scss" scoped>
.timeline {
  padding: 0 20rpx;

  :deep() {
    .nut-cell-group__wrap,
    .nut-cell {
      background: #fff !important;
      box-shadow: none !important;
    }

    .nut-cell {
      border-bottom: 1rpx solid #fafafa;
    }

    .nut-cell__value {
      color: #333 !important;
    }

    .nut-step-main {
      padding-bottom: 6%;
    }
  }

  .image-wrap {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .image-item {
      overflow: hidden;
      border: 2rpx solid #e5e7eb;
      background: #f8fafc;
      padding: 10rpx;
      height: 100rpx;
      width: 100rpx;
      border-radius: 10rpx;

      image {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}

.footer {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0rpx -2rpx 2rpx #f5f5f5;
  padding-bottom: calc(env(safe-area-inset-bottom) + 10rpx);
  padding-top: 30rpx;
  z-index: 99;

  .inner {
    width: 100%;
    height: 100%;
    padding: 0 50rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
