<template>
  <view class="mine">
    <navbar type="second" :title="title"></navbar>
    <view class="container">
      <view class="avatar">

        <u-row
            justify="space-between"
            gutter="-20"
        >
          <u-col span="3">
              <image :src="group.avatar"
                     mode="widthFix" style="width: 60px;height: 60px;"></image>
          </u-col>
          <u-col span="8">
            <u-col span="12">
              <u--text type="primary" :text="group.name" bold></u--text>
            </u-col>
            <u-col span="10">
              <u--text type="info" :text=" '群共'+groupUsers.length+'人'"></u--text>
            </u-col>
          </u-col>
          <u-col span="1">
            <u-icon style="font-size: 30px" class="iconfont icon-chat-qrcode" @click="popupShow=!popupShow"></u-icon>
          </u-col>
        </u-row>
      </view>
      <view class="main">
        <u-collapse
            @change="change"
            @close="close"
            @open="open"
        >
          <u-collapse-item
              title="简介"
              name="intro"
          >
            <u-icon name="order" size="20" slot="icon" color="#909399"></u-icon>
            <text class="u-collapse-content">{{group.intro}}</text>
          </u-collapse-item>
          <u-collapse-item
              title="群公告"
              name="notice"
          >
            <u-icon name="calendar" size="20" slot="icon" color="#909399"></u-icon>
            <text class="u-collapse-content">{{group.notice}}</text>
          </u-collapse-item>
          <u-collapse-item
              title="创建时间"
              name="createTime"
          >
            <u-icon name="clock" size="20" slot="icon" color="#909399"></u-icon>
            <text class="u-collapse-content">{{group.createTime}}</text>
          </u-collapse-item>
          <u-collapse-item
              title="群组员"
              name="groupUsers"
          >
            <u-icon name="account" size="20" slot="icon" color="#909399"></u-icon>
              <u-grid
                  :border="false"
                  col="4"
                  class="u-collapse-content"
              >
                <u-grid-item
                    style="margin-bottom: 10px"
                    v-for="(groupUser,listIndex) in groupUsers"
                    :key="listIndex"
                    @click="toFriendInfo(groupUser.userId)"
                >
                  <u--image :showLoading="true" :src="groupUser.userAvatar" width="40px" height="40px" style="margin-bottom: 5px"></u--image>
                  <u--text :lines="1" :text="groupUser.userNickname" style="flex-direction: column;"></u--text>
                </u-grid-item>
              </u-grid>
          </u-collapse-item>
        </u-collapse>
        <view class="row" v-if="inGroup">
          <u-button text="发送消息" type="success" @click="send" customStyle="margin-top: 50px"></u-button>
          <u-button text="拉人入群" type="primary" @click="pull" customStyle="margin-top: 10px"></u-button>
        </view>
        <view class="row" v-if="!inGroup">
          <u-button text="加入" type="success" @click="join" customStyle="margin-top: 50px"></u-button>
        </view>
      </view>
    </view>
    <u-modal
        content="确认加入群组!"
        :show="joinShow"
        showCancelButton
        closeOnClickOverlay
        @confirm="confirm"
        @cancel="cancel"
        @close="close"
    ></u-modal>
    <u-popup :show="popupShow" mode="center" @close="popupClose" bgColor="transparent">
      <view>
        <w-qrcode :options="options"></w-qrcode>
      </view>
    </u-popup>
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
      // 加入群组modal
      joinShow: false,
      // 二维码弹出层
      popupShow: false,
      // 删除好友提示modal
      delShow: false,
      // 头像List
      avatarList:[] ,
      // 头像
      avatar: "",
      // 标题
      title:"群名片",
      // 是否是好友
      isFriend:false,
      // 好友Id
      friendId:'',
      // 是否是自己
      notMe:true,
      // 群组信息
      group:{},
      // 群组员
      groupUsers:[{
        // 群头像
        userAvatar:'',
      }],
      // 是否在群组内
      inGroup:false,
      // 二维码配置
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
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapActions(["mLogout"]),
    // 折叠打开事件
    open(e) {
    },
    // 弹出层关闭
    popupClose() {
      this.popupShow = false
    },
    // 折叠变更事件
    change(e) {
      // console.log('change', e)
    },
    // 群组信息
    async groupInfo(){
      const groupId = this.groupId
      this.options.code ="group=" + groupId
      const result = await this.$api.groupDetail(groupId)
      if(!result.success){
        this.$tips.error(result.message)
        return
      }
      const group = result.data
      this.group = group
      this.groupUsers = group.groupUsers
      // 判断自己是否在群组内
      this.groupUsers.forEach(item=>{
        if(item.userId == this.userInfo.id){
          this.inGroup = true
        }
      })
    },
    // 去聊天
    send(){
      this.$Router.push({ path: '/pages/msg/groupMsg', query: {groupId:this.groupId}})
    },
    init() {
      this.groupInfo()
    },
    // 好友添加
    async add(){
      // 获取好友Id
      const friendId = this.friendId
      let param = {
        friendId
      }
      const result = await this.$api.invitation(param)
      if(!result.success){
        this.$tips.error(result.message)
        return
      }
      this.$Router.push({ path: '/pages/invitation/add'})
    },
    // 拉人入群
    async pull(){
      this.$Router.push({ path: '/pages/group/friendList', query: {groupId: this.groupId}})
    },
    // 确认
    async confirm(){
      const param = {
        groupId:this.groupId,
        userIds:this.userInfo.id
      }
      const result = await this.$api.groupJoin(param)
      if(!result.success){
        this.$tips.error(result.message)
        return
      }
      this.delShow = false
      uni.$u.toast("加入群组成功")
      setTimeout(()=>{
        uni.switchTab({
          url: '/pages/group/group',
        })
      },800)
    },
    // 查看组员
    toFriendInfo(userId){
      this.$Router.push({ path: '/pages/friend/info', query: {friendId:userId}})
    },
    // 加入群组
    join(){
      this.joinShow = true
    },
    // 取消
    cancel(){
      this.joinShow = false
    },
    // 关闭
    close(){
      this.joinShow = false
    }
  },
  mounted() {
    let query = this.$Route.query
    this.groupId = query.groupId
    this.init()
  }
}
</script>

<style lang="scss">
.container {
  padding: 40upx;

  .main {
    margin-top: 40upx;

    .row {
      margin-top: 10vh;
    }
  }
}
</style>
