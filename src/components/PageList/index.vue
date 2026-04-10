<template>
  <view v-if="data?.length > 0" id="pageListWrap" class="page-wrap">
    <view class="page-list">
      <view v-for="(item, index) in data" :key="index" class="page-item">
        <slot name="item" :data="item" />
      </view>
    </view>
    <view
      v-if="pageInfo.end && isOverScreen"
      class="relative flex h-[6vh] items-center justify-center text-[28rpx] text-[#999]"
    >
      没有更多了
    </view>
    <view v-if="pageInfo.loading && !isRefresh" class="relative h-[6vh]">
      <Loading position="absoluted" />
    </view>
  </view>
  <view v-else class="relative py-[10vh]">
    <Loading v-if="pageInfo.loading" show-text position="absoluted" />
    <Empty v-else />
  </view>
</template>

<script
  setup
  lang="ts"
  generic="T extends Record<string, any>, Q extends Record<string, any> = Record<string, never>"
>
// Record<string, never> = Record<string, never> = {}
// Record<string, never> 可以理解为“空对象参数类型”，你几乎不能往里放任何键值（因为值类型是 never）
import { useAppStore } from '@/stores/app'

interface PageListProps {
  api: (params: IPageParams & Q) => Promise<{ total: number; data: T[] } | T[]>
  active?: boolean
  params?: Q
  limit?: number
  contentFullHeight?: number
}

const props = withDefaults(defineProps<PageListProps>(), {
  active: true,
  params: () => ({}) as Q,
  limit: 10,
  contentFullHeight: () => uni.getSystemInfoSync().windowHeight,
})

const { appToken } = storeToRefs(useAppStore())

const instance = getCurrentInstance()

const pageInfo = ref({
    loading: false,
    end: false,
    page: 1,
    limit: props.limit,
  }),
  data = ref<T[]>([]) as Ref<T[]>,
  isOverScreen = ref(false),
  isRefresh = ref(false),
  isError = ref(false)

watch(
  () => props.active,
  (newValue) => {
    if (newValue && data.value.length === 0 && appToken.value) {
      getData(1)
    }
  },
  {
    immediate: true,
  },
)

async function getData(page?: number) {
  if (!appToken.value) return
  try {
    pageInfo.value.loading = true
    if (page == 1) {
      pageInfo.value.page = 1
      pageInfo.value.end = false
    }

    const requestParams = {
      ...props.params,
      page: pageInfo.value.page,
      limit: pageInfo.value.limit,
    } as IPageParams & Q

    const result = await props.api(requestParams)

    if (Array.isArray(result) && result.length === 0) {
      data.value = result
      pageInfo.value.end = true
      return
    }

    if (!Array.isArray(result)) {
      data.value = pageInfo.value.page == 1 ? result.data : data.value.concat(result.data)

      if (result.total <= data.value.length) {
        pageInfo.value.end = true
      }
      if (!isOverScreen.value) {
        checkOverScreen()
      }
    }
  } catch (_error) {
    isError.value = true
    pageInfo.value.loading = false
  } finally {
    pageInfo.value.loading = false
  }
}

// 检查内容是否超过一屏
function checkOverScreen() {
  setTimeout(() => {
    uni
      .createSelectorQuery()
      .in(instance?.proxy)
      .select('#pageListWrap')
      .boundingClientRect()
      .exec((res) => {
        if (res && res[0]) {
          const { height } = res[0]
          isOverScreen.value = (height ?? 0) > props.contentFullHeight
        }
      })
  })
}

onReachBottom(async () => {
  if (
    props.active &&
    !pageInfo.value.end &&
    !pageInfo.value.loading &&
    !isRefresh.value &&
    !isError.value
  ) {
    pageInfo.value.page++
    await getData()
  }
})

onPullDownRefresh(async () => {
  if (props.active && !pageInfo.value.loading) {
    try {
      isRefresh.value = true
      uni.showLoading({
        title: '下拉刷新中...',
        mask: true,
      })
      await getData(1)
    } finally {
      uni.hideLoading()
      isRefresh.value = false
    }
  }
  uni.stopPullDownRefresh()
})

defineExpose({
  async refresh() {
    try {
      isRefresh.value = true
      await getData(1)
    } finally {
      isRefresh.value = false
    }
  },
  getData() {
    return data.value
  },
})
</script>

<style lang="scss" scoped>
.page-wrap {
  .page-list {
    display: flex;
    flex-direction: column;
    row-gap: 20rpx;
  }
}
</style>
