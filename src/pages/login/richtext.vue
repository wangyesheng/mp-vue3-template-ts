<template>
  <AppContainer>
    <div class="richtext px-4 pt-4" v-html="addHtmlClassName(richText)"></div>
  </AppContainer>
</template>

<script setup>
import { addHtmlClassName } from '@/utils/uni'
import { getPrivateProtocolRes, getUserProtocolRes } from '../../api'

const richText = ref(null)
onLoad(async (options) => {
  let content
  if (options.type === '1') {
    uni.setNavigationBarTitle({ title: '用户协议' })
    content = await getUserProtocolRes()
  } else if (options.type === '2') {
    uni.setNavigationBarTitle({ title: '隐私政策' })
    content = await getPrivateProtocolRes()
  }
  richText.value = content?.replace(/<img/g, `<img style="width: 100%;"`)
})
</script>
