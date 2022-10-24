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
              <image :src="avatar"
                     mode="widthFix" style="width: 60px;height: 60px;"></image>
          </u-col>
          <u-col span="9">
            <u-col span="12">
              <u--text  type="primary" :text="user.nickname" bold></u--text>
            </u-col>
            <u-col span="12">
              <u--text :type="user.sex=='1'?'error':'success'" :text="user.sex==0?'未知':(user.sex==1?'男':'女')" :suffixIcon="user.sex=='2'?'woman':'man'"></u--text>
            </u-col>
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
            <text class="u-collapse-content">{{user.intro?user.intro:'快来介绍一下'}}</text>
          </u-collapse-item>
          <u-collapse-item
              title="生日"
              name="birthday"
          >
            <u-icon name="calendar" size="20" slot="icon" color="#909399"></u-icon>
            <text class="u-collapse-content">{{user.birthday?user.birthday: $moment(user.createTime).format('YYYY-MM-DD')}}</text>
          </u-collapse-item>
          <u-collapse-item
              title="加入时间"
              name="Variety components"
          >
            <u-icon name="clock" size="20" slot="icon" color="#909399"></u-icon>
            <text class="u-collapse-content">{{user.createTime?user.createTime:''}}</text>
          </u-collapse-item>
        </u-collapse>

        <view v-if="notMe">
          <view class="row" v-if="isFriend">
            <u-button text="发送消息" type="success" @click="send" customStyle="margin-top: 50px"></u-button>
            <u-button text="删除" type="error" @click="del" customStyle="margin-top: 10px"></u-button>
          </view>
          <view class="row" v-else>
            <u-button text="添加" type="success" @click="add" customStyle="margin-top: 50px"></u-button>
          </view>
        </view>
      </view>
    </view>
    <u-modal
        content="确认删除好友!"
        :show="delShow"
        showCancelButton
        closeOnClickOverlay
        @confirm="confirm"
        @cancel="cancel"
        @close="close"
    ></u-modal>
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
      // 删除好友提示modal
      delShow: false,
      // 头像
      avatar: "",
      // 标题
      title:"名片",
      // 用户对象
      user:{
        // 用户名
        username:'',
        // 昵称
        nickname:''
      },
      // 是否是好友
      isFriend:false,
      // 好友Id
      friendId:'',
      // 是否是自己
      notMe:true,
      // 好友信息
      friend:{}
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
    // 折叠更改事件
    change(e) {
    },
    // 获取用户信息
    async getUser() {
      const userId = this.friendId
      const res = await this.$api.userDetail(userId)
      if(!res.success){
        this.$tips.error(res.message)
        return
      }
      this.user = res.data
      this.avatar = this.user.avatar?this.user.avatar:'/static/img/javadog.png'
    },
    // 好友信息
    async friendInfo(){
      const friendId = this.friendId
      const result = await this.$api.friendDetail(friendId)
      if(!result.success){
        this.$tips.error(result.message)
        return
      }
      const friend = result.data
      if(friend){
        this.isFriend = true
      }
      this.user.nickname = friend.nickname
      this.friend = friend
    },
    // 去聊天
    send(){
      this.$Router.push({ path: '/pages/msg/friendMsg', query: {friendId:this.friendId, nickname:this.user.nickname}})
    },
    init() {
      this.getUser()
      this.friendInfo()
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
    // 删除事件
    async del(){
      this.delShow = true
    },
    // 删除确认
    async confirm(){
      const id = this.friend.id
      const result = await this.$api.friendDelete(id)
      if(!result.success){
        this.$tips.error(result.message)
        return
      }
      this.delShow = false
      uni.$u.toast("好友删除成功")
      setTimeout(()=>{
        uni.switchTab({
          url: '/pages/friend/friend',
        })
      },800)
    },
    // 删除确认弹出取消
    cancel(){
      this.delShow = false
    }
  },
  mounted() {
    let query = this.$Route.query
    this.friendId = query.friendId
    const mineId = this.userInfo.id
    if(mineId == this.friendId){
      this.notMe = false
    }
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
