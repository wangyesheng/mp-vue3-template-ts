<template>
  <!--  -->
  <view
    class="container"
    :style="{
      position,
      'z-index': zIndex,
      '--opacity': maskOpacity,
    }"
    :class="[
      mask ? 'mask' : '',
      maskMini ? 'mask-mini' : '',
      (mask || maskMini) && maskDark ? 'mask-dark' : '',
    ]"
    @click.prevent="handleClick"
  >
    <view class="inner">
      <view class="main">
        <Loading0 v-if="type == 'circle'" :color="color"></Loading0>
        <Loading1 v-if="type == 'pulse'" :color="color"></Loading1>
        <Loading2 v-if="type == 'bounce'"></Loading2>
        <Loading3 v-if="type == 'eyes'"></Loading3>
        <Loading4 v-if="type == 'surround'"></Loading4>
        <Loading5 v-if="type == 'sun'"></Loading5>
        <Loading6 v-if="type == 'love'"></Loading6>
        <Loading7 v-if="type == 'sword'" :color="color"></Loading7>
        <Loading8 v-if="type == 'atom'" :color="color"></Loading8>
        <Loading9 v-if="type == 'gear'"></Loading9>
        <Loading10 v-if="type == 'radar'"></Loading10>
        <Loading11 v-if="type == 'annulus'" :color="color"></Loading11>
        <Loading12 v-if="type == 'wobble'" :color="color"></Loading12>
        <Loading13 v-if="type == 'equal'" :color="color"></Loading13>
      </view>
      <view
        v-if="showText"
        class="tips"
        :style="{ color: textColor, fontSize: textSize, marginTop: textGap }"
      >
        {{ text }}
      </view>
    </view>
  </view>
</template>

<script>
import loading0 from './static/loading-circle.vue'
import loading1 from './static/loading-pulse.vue'
import loading2 from './static/loading-bounce.vue'
import loading3 from './static/loading-eyes.vue'
import loading4 from './static/loading-surround.vue'
import loading5 from './static/loading-sun.vue'
import loading6 from './static/loading-love.vue'
import loading7 from './static/loading-sword.vue'
import loading8 from './static/loading-atom.vue'
import loading9 from './static/loading-gear.vue'
import loading10 from './static/loading-radar.vue'
import loading11 from './static/loading-annulus.vue'
import loading12 from './static/loading-wobble.vue'
import loading13 from './static/loading-equal.vue'

export default {
  name: 'Loading',
  components: {
    Loading0: loading0,
    Loading1: loading1,
    Loading2: loading2,
    Loading3: loading3,
    Loading4: loading4,
    Loading5: loading5,
    Loading6: loading6,
    Loading7: loading7,
    Loading8: loading8,
    Loading9: loading9,
    Loading10: loading10,
    Loading11: loading11,
    Loading12: loading12,
    Loading13: loading13,
  },
  props: {
    type: {
      type: String,
      default: 'bounce',
    },
    position: {
      type: String,
      default: 'fixed',
    },
    zIndex: {
      type: Number,
      default: 9,
    },
    mask: {
      type: Boolean,
      default: false,
    },
    maskOpacity: {
      type: Number,
      default: 0.1,
    },
    maskMini: {
      type: Boolean,
      default: false,
    },
    maskDark: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '#1890ff',
    },
    showText: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '数据加载中...',
    },
    textSize: {
      type: String,
      default: '28rpx',
    },
    textColor: {
      type: String,
      default: '#666',
    },
    textGap: {
      type: String,
      default: '40rpx',
    },
  },
  emits: ['click'],
  data() {
    return {}
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  align-items: center;
  justify-content: center;

  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.tips {
  text-align: center;
}

.mask {
  z-index: 999 !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(255, 255, 255, var(--opacity));
  transform: translate(0, 0);
}

.mask-mini {
  height: 300rpx;
  width: 300rpx;
  border-radius: 20rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mask-dark {
  background: rgba(7, 17, 27, var(--opacity));
}
</style>
