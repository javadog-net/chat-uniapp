<template>
  <view class="webview">
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(param) {
    // 传入需要跳转的链接 使用web-view标签进行跳转
    this.url = decodeURIComponent(param.url)
    console.log("跳转链接=", param.url)
  }
}
</script>
<style lang="scss">
</style>
