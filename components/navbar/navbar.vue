<template>
  <view>
    <!--  #ifdef MP  -->
    <u-navbar class="MP" :title="title" :safeAreaInsetTop="true" placeholder style="border-bottom: 1px solid #efefef" v-if="type == 'main' && !isSearch">
      <view class="u-nav-slot" slot="left">
        <u-icon name="search" size="24" top="0" @click="showSearch"></u-icon>
        <u-line direction="column" :hairline="false" length="16" margin="0 10px"></u-line>
        <u-icon name="scan" size="20" @click="scan"></u-icon>
      </view>
      <view class="u-nav-slot" slot="right">

      </view>
    </u-navbar>
    <view v-if="isSearch" class="u-navbar__placeholder" :style="{height: systemBarHeight + 'px'}"></view>
    <view v-if="isSearch" class="search" style="display: flex; align-items: center; height: 44px !important; justify-content: center;">
      <u-search :show-action="true" actionText=" " :animation="false" @custom="cancel" @search="search" @change="change" style="padding: 0 20upx ; height: 45px;"></u-search>
    </view>

    <u-navbar :title="title" :safeAreaInsetTop="true" placeholder style="border-bottom: 1px solid #efefef" v-if="type == 'second' && !isSearch">
      <view class="u-nav-slot" slot="left">
        <u-icon v-if="isBack" name="arrow-left" size="20" top="0" @click="navigateBack"></u-icon>
      </view>
      <view class="u-nav-slot" slot="right">
        <u-icon v-if="isMore" name="more-dot-fill" size="24" top="0" @click="more"></u-icon>
      </view>
    </u-navbar>
    <!--  #endif  -->

    <!--  #ifdef H5  -->
    <u-navbar class="H5" :title="title" :safeAreaInsetTop="true" placeholder style="border-bottom: 1px solid #efefef" v-if="type == 'main' && !isSearch">
      <view class="u-nav-slot" slot="left">
      </view>
      <view class="u-nav-slot" slot="right">
        <u-icon name="search" size="24" top="0" @click="showSearch"></u-icon>
        <u-line direction="column" :hairline="false" length="16" margin="0 10px"></u-line>
        <u-icon name="scan" size="20" @click="scan"></u-icon>
      </view>
    </u-navbar>

    <u-row v-if="isSearch" class="search" placeholder style="position: fixed">
      <u-search :show-action="true" actionText="取消" :animation="false" @custom="cancel" @search="search" @change="change" style="padding: 0 20upx ; height: 45px;"></u-search>
    </u-row>
    <view v-if="isSearch" class="u-navbar__placeholder" style="height: 45px;"></view>

    <u-navbar :title="title" :safeAreaInsetTop="true" placeholder style="border-bottom: 1px solid #efefef" v-if="type == 'second' && !isSearch">
      <view class="u-nav-slot" slot="left">
        <u-icon v-if="isBack" name="arrow-left" size="20" top="0" @click="navigateBack"></u-icon>
      </view>
      <view class="u-nav-slot" slot="right">
        <u-icon v-if="isMore" name="more-dot-fill" size="24" top="0" @click="more"></u-icon>
      </view>
    </u-navbar>
    <!--  #endif  -->

    <!--  #ifdef APP-PLUS  -->
    <u-navbar class="APP-PLUS" :title="title" :safeAreaInsetTop="true" placeholder style="border-bottom: 1px solid #efefef" v-if="type == 'main' && !isSearch">
      <view class="u-nav-slot" slot="left">

      </view>
      <view class="u-nav-slot" slot="right">
        <u-icon name="search" size="24" top="0" @click="showSearch"></u-icon>
        <u-line direction="column" :hairline="false" length="16" margin="0 10px"></u-line>
        <u-icon name="scan" size="20" @click="scan"></u-icon>
      </view>
    </u-navbar>

    <view v-if="isSearch" class="u-navbar__placeholder" :style="{height: systemBarHeight + 'px'}"></view>
    <view v-if="isSearch" class="search" style="display: flex; align-items: center; height: 44px !important; justify-content: center;">
      <u-search :show-action="true" actionText=" " :animation="false" @custom="cancel" @search="search" @change="change" style="padding: 0 20upx ; height: 45px;"></u-search>
    </view>

    <u-navbar :title="title" :safeAreaInsetTop="true" placeholder style="border-bottom: 1px solid #efefef" v-if="type == 'second' && !isSearch">
      <view class="u-nav-slot" slot="left">
        <u-icon v-if="isBack" name="arrow-left" size="20" top="0" @click="navigateBack(true)"></u-icon>
      </view>
      <view class="u-nav-slot" slot="right">
        <u-icon v-if="isMore" name="more-dot-fill" size="24" top="0" @click="more"></u-icon>
      </view>
    </u-navbar>
    <!--  #endif  -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 关键字
      keyword: '',
      // 是否搜索
      isSearch: false,
      // 弹出层
      show: false,
      // 系统状态栏的高度
      systemBarHeight: 0
    }
  },
  props: {
    // 标题
    title: {
      type: String,
      required: false,
      default: "聊天"
    },
    // 返回
    isBack: {
      type: Boolean,
      required: false,
      default: true
    },
    // 更多
    isMore: {
      type: Boolean,
      required: false,
      default: false
    },
    // 类型
    type: {
      type: String,
      required: false,
      default: "main"
    }
  },
  mounted(){
    this.init();
  },
  methods: {
    // 总初始化方法
    init(){
      this.getSysteminfo();
    },
    // 获取系统栏高度
    getSysteminfo() {
      uni.getSystemInfo({
        success: res => {
          this.systemBarHeight = res.statusBarHeight;
          console.log("res.statusBarHeight",res.statusBarHeight)
        }
      });
    },
    // 上一页
    navigateBack() {
      // 获取当前打开过的页面路由数组
      const currentRoutes = getCurrentPages();
      const length = currentRoutes.length
      if(length>1){
        const page2 = currentRoutes[currentRoutes.length - 2].route
        if(page2 == this.$config.friendMsgUrl || page2 == this.$config.groupMsgUrl){
          uni.switchTab({
            url: '/pages/index/index',
          })
        }
      }else{
        uni.switchTab({
          url: '/pages/index/index',
        })
      }
      uni.navigateBack({
        delta: 1
      });
    },
    // 展示是否搜索
    showSearch() {
      this.isSearch = !this.isSearch
      this.$emit("showSearch")
    },
    // 取消触发事件
    cancel(val){
      this.isSearch = !this.isSearch
      this.$emit("cancel",val)
    },
    // 搜索触发事件
    search(val){
      this.$emit("search",val)
    },
    // 数据变更触发事件
    change(val){
      this.$emit("change",val)
    },
    // 二维码扫描
    scan(){
      const _this = this
      // 允许从相机和相册扫码
      uni.scanCode({
        success: function (res) {
          console.log('条码类型：' + res.scanType)
          console.log('条码内容：' + res.result)
          // 区分是好友friend=1493203687051304961/群组group=1493203687051304961/其他xxx
          const result = res.result
          if(result){
            // 包含好友或群组
            if(result.indexOf("=") != -1){
              let arr = result.split("=")
              if('friend' == arr[0]){
                // 好友
                _this.$Router.push({ path: '/pages/friend/info', query: {friendId:arr[1]}})
              }else if ('group' == arr[0]){
                // 群组
                _this.$Router.push({ path: '/pages/group/info', query: {groupId:arr[1]}})
              }
            }else{
              // webview
              const url = result
              _this.$Router.push({path: '/pages/webview/webview', query: {url: url}})
            }
          }

        }
      })
    }
  }
}
</script>

<style lang="scss">
/* #ifndef APP-NVUE */
page {
  background-color: $u-bg-color;
}

/* #endif */

.u-page {
  padding: 0;
  flex: 1;
  background-color: $u-bg-color;

  &__item {

    &__title {
      color: $u-tips-color;
      background-color: $u-bg-color;
      padding: 15px;
      font-size: 15px;

      &__slot-title {
        color: $u-primary;
        font-size: 14px;
      }
    }
  }
}

.u-nav-slot {
  @include flex;
  align-items: center;
  justify-content: space-between;
  border-width: 0.5px;
  border-radius: 100px;
  border-color: $u-border-color;
  padding: 3px 7px;
  opacity: 0.8;
}
.u-row{
  margin: 0 auto;
  width: 100%;
  height: 88upx;
}

.u-search{
  height: 44px !important;
}

</style>
