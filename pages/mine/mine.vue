<template>
  <view class="mine">
    <navbar type="second" back="false" title="我的"></navbar>
    <view class="container">
      <view class="avatar">

        <u-row
            justify="space-between"
            gutter="-20"
        >
          <u-col span="3">
            <u-upload
                :fileList="avatarList"
                @afterRead="afterRead"
                name="file"
                multiple
                :maxCount="1"
                width="150"
                height="150"
            >
              <image :src="avatar"
                     mode="widthFix" style="width: 60px;height: 60px;"></image>
            </u-upload>
          </u-col>
          <u-col span="9">
            <u-col span="12">
              <u--text  type="primary" :text="user.username" bold></u--text>
            </u-col>
            <u-col span="12">
              <u--text  type="success" :text="user.nickname"></u--text>
            </u-col>
          </u-col>
        </u-row>
      </view>
      <view class="main">
        <u-cell-group :border="false">
          <u-cell
              size="large"
              title="我的名片"
              icon="integral"
              isLink
              @click="toCard"
          ></u-cell>
          <u-cell
              size="large"
              title="我的资料"
              icon="email"
              isLink
              @click="toInfo"
          ></u-cell>
          <u-cell
              size="large"
              title="修改密码"
              icon="info-circle"
              isLink
              @click="toUpdatePwd"
          ></u-cell>
          <u-cell
              size="large"
              title="关于"
              icon="gift"
              isLink
              @click="toAbout"
          ></u-cell>
        </u-cell-group>

        <view class="row">
          <u-button text="退出" type="error" @click="logout"></u-button>
        </view>
      </view>
    </view>
    <u-popup :show="show" mode="center" @close="close" bgColor="transparent">
      <view>
        <w-qrcode :options="options"></w-qrcode>
      </view>
    </u-popup>
    <!--修改密码-->
    <u-modal
        :asyncClose="true"
        title="修改密码"
        :show="modalShow"
        closeOnClickOverlay
        showCancelButton
        @close="() => modalShow = false"
    >
      <view class="slot-content" style="width: 100%">
        <u-alert title="请录入之前老密码与新密码" type="info" :show-icon="true"></u-alert>
        <u--input
            style="margin-top: 10px"
            placeholder="请输入老密码"
            border="surround"
            v-model="updatePwd.oldPwd"
        ></u--input>
        <u--input
            style="margin-top: 10px"
            placeholder="请输入新密码"
            border="surround"
            v-model="updatePwd.newPwd"
        ></u--input>
        <u--input
            style="margin-top: 10px"
            placeholder="请确认新密码"
            border="surround"
            v-model="updatePwd.comfirmPwd"
        ></u--input>
      </view>
      <u-button
          slot="confirmButton"
          text="重置"
          type="success"
          shape="circle"
          @click="reset"
      ></u-button>
    </u-modal>
  </view>
</template>

<script>
import {
  mapActions,
  mapGetters
} from "vuex"

export default {

  data() {
    return {
      // 二维码展示标识
      show: false,
      // 修改密码模态框
      modalShow:false,
      // 头像列表
      avatarList:[] ,
      // 头像
      avatar: "",
      // 二维码参数
      options: {
        code: 'https://qm.qq.com/cgi-bin/qm/qr?k=LKqML292dD2WvwQfAJXBUmvgbiB_TZWF&noverify=0',// 生成二维码的值
        border: {
          color: ['#F27121', '#8A2387', '#1b82d2'], //边框颜色支持渐变色 最多10种颜色 如果默认黑色此属性不需要传
          opacity: 0.6, //边框透明度 默认为1不透明 0~1
          lineWidth: 6, //边框宽度
          degree: 15 //边框圆角度数 默认5
        },
        size: 460,// 460代表生成的二维码的宽高均为460rpx
      },
      // 用户信息
      user:{
        // 用户名
        username:'',
        // 昵称
        nickname:''
      },
      // 更改密码对象
      updatePwd:{
        // 老密码
        oldPwd:'',
        // 新密码
        newPwd:'',
        // 确认密码
        comfirmPwd:'',
      },
      // 邀请数
      invitationNum: this.$invitationNum
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapActions(["mLogout"]),
    async afterRead(file, lists, name) {
      const result = await this.$api.upload(file.file[0].url)
      if (result.success) {
        const data = result.data
        this.avatar = this.$config.baseUrl + data.url
        // 入库更新用户信息
        this.updateInfo(this.avatar)
      }
    },
    // 登出
    async logout() {
      const result = await this.$api.logout()
      if (result.success) {
        this.mLogout(result.data)
        this.$Router.push("/pages/login/index")
      }
    },
    // 我的名片
    toCard() {
      this.show = true
    },
    // 关于
    toAbout() {
      const url = "https://blog.javadog.net"
      this.$Router.push({path: '/pages/webview/webview', query: {url: url}})
    },
    // 个人信息
    toInfo() {
      this.$Router.push({path: '/pages/mine/info'})
    },
    close() {
      this.show = false
    },
    // 修改密码
    toUpdatePwd(){
      this.modalShow = true
    },
    async updateInfo(avatar){
      this.user['avatar'] = avatar
      const result = await this.$api.userUpdate(this.user)
      if(result.success){
        this.$tips.success("头像更新成功")
      }
    },
    async mineInfo() {
      const userId = this.userInfo.id
      this.options.code ="friend=" + userId
      const res = await this.$api.userDetail(userId)
      if(!res.success){
        this.$tips.error(res.message)
        return
      }
      this.user = res.data
      this.avatar = this.user.avatar?this.user.avatar:'/static/img/javadog.png'
    },
    // 密码重置
    async reset(){
      const {oldPwd, newPwd, comfirmPwd} = this.updatePwd

      if(!oldPwd || !newPwd || !comfirmPwd){
        uni.$u.toast("请输入老密码及新密码!")
        return
      }
      if(oldPwd.length<6 || newPwd.length<6 || comfirmPwd.length<6){
        uni.$u.toast("请确保密码长度至少大于6位!")
        return
      }
      if(newPwd != comfirmPwd){
        uni.$u.toast("新密码与确认密码不一致!")
        return
      }
      const result = await this.$api.userPwd(this.updatePwd)
      if (result.success) {
        uni.$u.toast("操作成功")
        this.modalShow = false
      }else {
        uni.$u.toast(result.message)
      }
    },
    init() {
      this.mineInfo()
    },
  },
  onShow() {
    this.init()
  },
  mounted() {
    // this.init()
  }
}
</script>

<style lang="scss">
.container {
  padding: 40upx;

  .main {
    margin-top: 40upx;
    border-top: 1px solid #efefef;

    .row {
      margin-top: 10vh;
    }
  }
}
</style>
