<template>
  <view v-if="data?.length > 0" id="pageListWrap" class="page-list-wrap">
    <view v-if="renderType == 'text'" class="page-inner" :style="{ '--item-gap': `${gap}rpx` }">
      <view v-for="item in data" :key="getItemKey(item)" :style="getPageItemStyle()">
        <slot name="item" :data="item" />
      </view>
    </view>
    <view v-if="renderType == 'checkbox'" class="page-inner">
      <nut-checkbox
        v-model="selectedAll"
        :indeterminate="indeterminate"
        @change="onToggleSelectAll"
      >
        <div class="mb-2 flex items-center justify-between text-sm font-[550]">
          <span>全选</span>
          <span class="text-xs text-[var(--uvt-primary-color)]">
            已选 {{ selectedKeys.length }} 项
          </span>
        </div>
      </nut-checkbox>
      <nut-checkbox-group ref="checkboxGroupRef" v-model="selectedKeys" @change="onGroupChange">
        <nut-checkbox v-for="item in data" :key="getItemKey(item)" :label="item[primaryKey]">
          <slot name="item" :data="item" />
        </nut-checkbox>
      </nut-checkbox-group>
    </view>

    <view
      v-if="pageInfo.end && isOverScreen"
      class="relative flex h-[6vh] items-center justify-center text-[28rpx] text-[#999]"
    >
      没有更多了...
    </view>
    <view v-if="pageInfo.loading && !isRefresh" class="relative h-[6vh]">
      <Loading position="absoluted" />
    </view>
  </view>
  <view v-else class="relative py-[8vh]">
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
import type { CheckboxGroupInst } from 'nutui-uniapp'

type RenderType = 'text' | 'radio' | 'checkbox'
interface PageListProps {
  api: (params: IPageParams & Q) => Promise<{ total: number; data: T[] } | T[]>
  active?: boolean
  params?: Q
  limit?: number
  cols?: number
  contentFullHeight?: number
  renderType?: RenderType
  primaryKey?: string
  itemKey?: (item: T) => string | number
}

const props = withDefaults(defineProps<PageListProps>(), {
  active: false,
  params: () => ({}) as Q,
  limit: 10,
  cols: 1,
  contentFullHeight: () => uni.getSystemInfoSync().windowHeight,
  renderType: 'text',
  primaryKey: 'id',
})

function getItemKey(item: T) {
  return props.itemKey ? props.itemKey(item) : item[props.primaryKey]
}

const gap = 20
function getPageItemStyle() {
  if (props.cols == 1) return { width: '100%' }

  // 一行多列的情况下，需要计算(总宽度 - (总列数 - 1 * 间隔 gap)) / 总列数
  // 假设一行三列，gap 设置的是 20，那么第一列与第二列有间隔，第二列与第三列有间隔，也就是总间隔为 2 * 20
  // 即每列宽度就得以 (100% - (3 - 1 * 20)) / 3 => (100% - 40) / 3 => (100 / 3)% - 40 / 3
  // 这里还有一个坑，就是假设单位换成 rpx 的话，那么 13.33333rpx 在小程序渲染的时候就会变成 6px，所以此处直接除 2 以 px 为单位
  const rest = `${((props.cols - 1) * gap) / props.cols / 2}px`
  return {
    width: `calc(${100 / props.cols}% - ${rest})`,
  }
}

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
  isError = ref(false),
  checkboxGroupRef = ref<CheckboxGroupInst>(),
  selectedKeys = ref([]),
  indeterminate = ref(false), // 当前是否支持半选状态，一般用在全选操作中
  selectedAll = ref(false)

watch(
  () => props.active,
  async (newValue) => {
    if (newValue && data.value.length === 0 && appToken.value) {
      await getData(1)
    }
  },
  {
    immediate: true,
  },
)

function onGroupChange(values: any[]) {
  if (values.length >= data.value.length) {
    indeterminate.value = false
    selectedAll.value = true
  } else if (values.length > 0) {
    indeterminate.value = true
  } else {
    indeterminate.value = false
    selectedAll.value = false
  }
}
function onToggleSelectAll(checked: boolean) {
  checkboxGroupRef.value?.toggleAll(checked)
}

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
      await nextTick()
      await getData(1)
    } finally {
      isRefresh.value = false
    }
  },
  getData() {
    return data.value
  },
  getSelectedKeys() {
    return selectedKeys.value
  },
})
</script>
