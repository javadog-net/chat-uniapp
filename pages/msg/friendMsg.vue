<template>
  <view class="friendMsg">
    <navbar type="second" :isBack="true" :title="nickname"></navbar>
    <view class="container">
      <!-- 需配置bottom的偏移量, 用于底部留白 -->
      <mescroll-body :fixed="false" class="mescroll" :safearea="true" ref="mescrollRef" bottom="108upx" @init="mescrollInit" :down="downOption" @down="downEvent" :up="upOption">
          <!-- 无更多消息 -->
          <view v-if="isEnd" class="msg-end">没有更多消息了</view>
          <msg :position="item.fromUserId==userId?'right':'left'" :avatar="item.fromUserId==userId?myAvatar:friendAvatar" :content="item.msgContent" :id="'msg_'+item.id" :msgType="item.msgType" :time="item.time"
               v-for="item in msgList" :nickname="item.nickname" source="0" :status="item.status" @reView="reView" @friendInfo="friendInfo" :msgId="item.id+''" :targetId="item.fromUserId==userId?userId+'':item.fromUserId+''" :key="item.id" @msgHandle="msgHandle"></msg>
      </mescroll-body>
    </view>
    <inputBox @sendMsg="sendMsg"></inputBox>
  </view>
</template>

<script>
import MescrollMixin from "mescroll-uni";
import MescrollBody from "@/node_modules/mescroll-uni/mescroll-body.vue";

import {
  mapGetters
} from "vuex"

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    MescrollBody
  },
  data() {
    return {
      // mescroll对象
      mescroll: null,
      // 加载框状态
      status: 'loading ',
      // 消息列表
      msgList: [],
      // 好友Id
      friendId: '',
      // 用户Id
      userId: '',
      // 昵称
      nickname: '',
      // 我的头像
      myAvatar:'/static/img/javadog.png',
      // 朋友头像
      friendAvatar:'/static/img/javadog.png',
      // 是否最后
      downOption:{
        // 显示下拉刷新的进度条
        autoShowLoading: true,
        // 下拉刷新的文本颜色
        textColor: "#FF8095",
        // 自动加载
        auto: false,
        // 是否滚动条必须在顶部,才可以下拉刷新
        mustToTop: true,
      },
      upOption: {
        // 禁止上拉
        use: false,
        toTop: {
          // 不显示回到顶部按钮
          src: ''
        }
      },
      pageNum: 1, // 页码
      pageSize: 20, // 页长
      isEnd: false, // 是否无消息
    }
  },
  mounted() {
    let query = this.$Route.query
    this.friendId = query.friendId
    this.nickname = query.nickname
    this.userId = this.userInfo.id
    this.baseParam = {
      'fromUserId': this.userId,
      'toUserId': this.friendId,
    }
    this.init()
  },
  onLoad() {
    const _this = this
    this.$EventBus.$on('friendMsgBus', function (data) {
      console.log("friendMsgBus事件总线", data)
      _this.pushMsg(JSON.parse(data))
    })
    this.$EventBus.$on('msgHandleBus', function (data) {
      console.log("msgHandleBus事件总线", data)
      data = data.replace(/\"id\":(\d+)/, '"id": "$1"')
      const result = JSON.parse(data)
      _this.handleData(result.id, result.type)
    })
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async init() {
      // 获取用户头像
      await this.avatar()
      // 更新好友信息
      await this.updateFriend()
      // 初始化消息
      await this.msgPage(true);
    },
    // 滚动初始化
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 获取用户信息
    async avatar(){
      // 获取当前用户信息
      const userId = this.userInfo.id
      const res = await this.$api.userDetail(userId)
      if(!res.success){
        this.$tips.error(res.message)
        return
      }
      const user = res.data
      this.myAvatar = user.avatar?user.avatar:'/static/img/javadog.png'
      // 获取朋友用户信息
      const friendId = this.friendId
      const friendRes = await this.$api.userDetail(friendId)
      if(!friendRes.success){
        this.$tips.error(friendRes.message)
        return
      }
      const friend = friendRes.data
      this.friendAvatar = friend.avatar?friend.avatar:'/static/img/javadog.png'
    },
    // 转化文字
    covertText(msg){
      const baseParam = uni.$u.deepClone(this.baseParam)
      let endMsg = {
        ...baseParam,
        ...msg
      }
      return endMsg
    },
    // 转化图片
    async covertImage(msg){
      const baseParam = uni.$u.deepClone(this.baseParam)
      let endMsg = {
        ...baseParam,
        ...msg
      }
      const {url} = msg
      // 上传图片
      const result = await this.$api.upload(url)
      if (result.success) {
        const fileUrl = this.$config.baseUrl + result.data.url
        endMsg['msgContent'] = fileUrl
      }
      return endMsg
    },
    // 转化音频
    async covertVoice(msg){
      const baseParam = uni.$u.deepClone(this.baseParam)
      let endMsg = {
        ...baseParam,
        ...msg
      }
      const {url} = msg
      // 上传语音
      const result = await this.$api.upload(url)
      console.log("result", result)
      if (result.success) {
        const fileUrl = this.$config.baseUrl + result.data.url
        endMsg['msgContent'] = fileUrl
      }
      return endMsg
    },
    // 转化视频
    async covertVideo(msg){
      const baseParam = uni.$u.deepClone(this.baseParam)
      let endMsg = {
        ...baseParam,
        ...msg
      }
      const {url} = msg
      // 上传视频
      const result = await this.$api.upload(url)
      console.log("result", result)
      if (result.success) {
        const fileUrl = this.$config.baseUrl + result.data.url
        endMsg['msgContent'] = fileUrl
      }
      return endMsg
    },
    // 发送消息
    async sendMsg(msg) {
      console.log("msg",JSON.stringify(msg))
      // 初始化最终返回值
      let endMsg = {}
      // 获取发送类型-消息类型(0-系统消息;1-文字;2-图片;3-语音;4-视频)
      const {msgType} = msg
      // 各种类型处理
      switch (msgType) {
        case 1:
          endMsg = this.covertText(msg)
          break
        case 2:
          endMsg =  await this.covertImage(msg)
          break
        case 3:
          endMsg =  await this.covertVoice(msg)
          break
        case 4:
          endMsg =  await this.covertVideo(msg)
          break
      }
      // 消息发送
      const result = await this.$api.sendFriendMsg(endMsg)
      if (result.success) {
        // id回填
        endMsg.id = result.data.id
        this.pushMsg(endMsg)
      }
    },
    // 塞入消息数组
    pushMsg(msg) {
      this.msgList.push(msg)
      this.$nextTick(function () {
        this.mescroll.scrollTo(99999, 0)
      })
    },
    // 下拉回调
    downEvent(){
      this.msgPage()
    },
    // 滚动到顶部触发
    async msgPage(flag){
      let _this = this
      // 参数
     const params = {
        'fromUserId': this.userId,
        'toUserId': this.friendId,
        'current': this.pageNum,
        'size': this.pageSize,
      }
      const result = await this.$api.friendMsgPage(params)
      if (!result.success) {
        this.$tips.error(result.message)
        return
      }
      // 需自行维护页码
      this.pageNum ++;
      // 先隐藏下拉刷新的状态
      this.mescroll.endSuccess(this.pageSize)
      const data = result.data;
      const {records} = data;
      // 不满一页,说明已经无更多消息
      if(records.length < this.pageSize){
        // 标记已无更多消息
        this.isEnd = true;
        this.mescroll.lockDownScroll(true); // 锁定下拉
      }
      const msgList = uni.$u.deepClone(this.msgList)
      const topMsg = msgList[0]
      const filterMsgList = this.msgFilter(records)
      this.msgList = filterMsgList.concat(msgList)
      this.$nextTick(()=>{
        if(this.pageNum <= 2){
          // 第一页直接滚动到底部 ( this.pageNum已在前面加1 )
          _this.mescroll.scrollTo(99999, 0)
        }else if(topMsg){
          // 保持顶部消息的位置
          let view = uni.createSelectorQuery().select('#msg_'+topMsg.id);
          view.boundingClientRect(v => {
            console.log("节点离页面顶部的距离=" + v.top);
            _this.mescroll.scrollTo(v.top - 100, 0) // 减去上偏移量100
          }).exec();
        }
        if(Boolean(flag)){
          // 第一页直接滚动到底部 ( this.pageNum已在前面加1 )
          _this.mescroll.scrollTo('msg_' +this.msgList[this.msgList.length-1].id , 300)
        }
      })
    },
    // 消息过滤
    msgFilter(msgList){
      const len = msgList.length
      const endMsgList = []
      for(let i=len-1; i>=0; i--){
        endMsgList.push(msgList[i])
      }
      return endMsgList
    },
    // 好友信息
    friendInfo(friendId){
      this.$Router.push({ path: '/pages/friend/info', query: {friendId:friendId}})
    },
    // 更新好友
    async updateFriend(){
      const result = await this.$api.friendDetail(this.friendId)
      if (!result.success) {
        this.$tips.error(result.message)
        return
      }
      let friend = result.data
      if(!friend){
        this.$tips.error("好友不存在!")
        return
      }
      if(friend.avatar != this.friendAvatar){
        friend.avatar = this.friendAvatar
        // 更新用户信息
        await this.$api.friendUpdate(friend)
      }
    },
    // 撤销/删除
    async msgHandle(val){
      const {msgId, index} = val
      const result = await this.$api.friendMsgHandle({id:msgId, type:index})
      if (!result.success) {
        this.$tips.error(result.message)
        return
      }
      this.handleData(msgId, index)

    },
    // 处理数据
    handleData(msgId, status){
      let targetIndex = 0
      const target = this.msgList.find((value,index,arr)=>{
        if(value.id == msgId){
          targetIndex = index
          return value
        }
      })
      target.msgType = 0
      target.status = status
      this.$set(this.msgList,targetIndex,target)
    },
    // 删除重新查看
    reView(val){
      let targetIndex = 0
      const target = this.msgList.find((value,index,arr)=>{
        if(value.id == val){
          targetIndex = index
          return value
        }
      })
      target.msgType = 1
      this.$set(this.msgList,targetIndex,target)
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  background: #F5F5F5;
}
.container{
  //height: calc(100vh);
}
::v-deep .uni-scroll-view{
  height: auto;
}
/* 无更多消息 */
.msg-end{
  padding: 40rpx 0;
  font-size: 24rpx;
  text-align: center;
  color: #FF8095;
}
::v-deep .mescroll-body-content,::v-deep .mescroll-wxs-content{
  transform: translateY(0px) !important;
}
::v-deep .mescroll-body {
  min-height: auto !important;
}

</style>
