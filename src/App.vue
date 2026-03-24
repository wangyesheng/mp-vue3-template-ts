<script setup lang="ts">
// import { useAppStore } from '@/stores/app'

// const LOGIN_PAGE = '/pages/login/index'
// const WHITE_LIST = [LOGIN_PAGE]

// function createAuthInterceptor(type: string) {
//   uni.addInterceptor(type, {
//     invoke(args: { url: string }) {
//       console.log('app - invoke')

//       const path = args.url.split('?')[0]
//       if (WHITE_LIST.some((p) => path.endsWith(p))) {
//         return
//       }
//       const appStore = useAppStore()
//       if (!appStore.appToken) {
//         uni.reLaunch({ url: LOGIN_PAGE })
//         return false
//       }
//     },
//   })
// }

onLaunch(() => {
  // const appStore = useAppStore()
  // // 注册路由拦截
  // createAuthInterceptor('navigateTo')
  // createAuthInterceptor('redirectTo')
  // createAuthInterceptor('reLaunch')
  // createAuthInterceptor('switchTab')
  // // 启动时检查登录状态
  // if (!appStore.appToken) {
  //   console.log('app - onLaunch')
  //   uni.reLaunch({ url: LOGIN_PAGE })
  // }
})
</script>

<style lang="scss">
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import 'nutui-uniapp/styles/index';
@import './index';

/*  #ifdef  H5  */
svg {
  display: initial;
}

/*  #endif  */

@layer components {
  .raw-btn {
    // 注意 after: 后面不能加任何空格，有些格式化工具可能会在这里自动加一个空格
    @apply inline-flex items-center gap-2 rounded text-sm font-semibold transition-all after:border-none;
  }

  .btn {
    // 使用上面定义的 raw-btn
    @apply raw-btn bg-gradient-to-r from-[#9e58e9] to-blue-500 px-2 py-1 text-white;
  }
}
</style>
