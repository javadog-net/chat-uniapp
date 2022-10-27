<template>
  <view class="index" style="overflow-y: hidden;position: fixed;">
    <navbar @change="change" @showSearch="showSearch" @cancel="cancel"></navbar>
    <u-empty v-if="(msgList.length==0 && !searchShow)" marginTop="200upx" mode="message"
             icon="http://cdn.uviewui.com/uview/empty/message.png">
    </u-empty>
    <u-empty v-if="(userList.length==0 && searchShow)" marginTop="200upx" mode="search">
    </u-empty>
      <view v-if="msgList.length>0 && !searchShow" class="container">
        <mescroll-body @init="mescrollInit" ref="mescrollRef" @down="downCallback" :up="upOption">
          <u-list
            height="auto"
        >
          <u-list-item
              v-for="(item, index) in msgList"
              :key="index"
          >
            <view @click="toChat(item)">
              <u-cell
                  :title="item.targetName"
                  :value="formatTime(item.lastTime)"
                  :label="formatLabel(item)"
                  center
              >
                <view
                    slot="icon"
                    class="u-slot-title"
                    style="position: relative;"
                >
                  <u-badge
                      type="error"
                      :value="item.unread==null?0:item.unread"
                      absolute
                      style="z-index: 1;"
                      :offset="[-10,1]"
                  >
                  </u-badge>
                  <u-avatar
                      shape="square"
                      size="35"
                      :src="item.targetAvatar"
                      customStyle="margin: -3px 5px -3px 0"
                  ></u-avatar>
                </view>

              </u-cell>
            </view>
          </u-list-item>
        </u-list>
        </mescroll-body>
      </view>
      <view v-if="userList.length>0 && searchShow" class="container">
      <u-list
          height="auto"
      >
        <u-list-item
            v-for="(item, index) in userList"
            :key="index"
        >
          <view @click="toFriend(item)">
            <u-cell
                :title="format(item.username)"
                :label="item.nickname"
                center
            >
              <view
                  slot="icon"
                  class="u-slot-title"
                  style="position: relative;"
              >
                <u-avatar
                    shape="square"
                    size="35"
                    :src="item.avatar"
                    customStyle="margin: -3px 5px -3px 0"
                ></u-avatar>
              </view>

            </u-cell>
          </view>
        </u-list-item>
      </u-list>
    </view>
    <u-popup :show="popupShow" mode="top" @close="close">
      <view>
        <u-row  @click="toMessage" class="popup"
            justify="space-between"
            style="padding: 10px 15px;"
        >
          <u-col span="2">
            <u--image :showLoading="true" :src="popupObj.avatar" width="60" height="60"></u--image>
          </u-col>
          <u-col span="8" style="margin-left: 15px">
            <u-col span="14">
              <u--text color="#fff" :text="popupObj.nickname" bold></u--text>
            </u-col>
            <u-col span="12">
              <u--text  color="#fff"  :text="popupObj.content"></u--text>
            </u-col>
          </u-col>
          <u-col span="2">
            <u-icon size="40" color="#fff" name="chat" @click="popupShow=!popupShow"></u-icon>
          </u-col>
        </u-row>
      </view>
    </u-popup>
  </view>
</template>

<script>
import MescrollMixin from "mescroll-uni";
import MescrollBody from "@/node_modules/mescroll-uni/mescroll-body.vue";
import {
  mapGetters,
  mapActions
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
      // 消息列表
      msgList: [],
      // 弹出层
      popupShow: false,
      // 搜索框切换与否
      searchShow: false,
      // 用户列表
      userList:[],
      // 基础分页参数
      baseParams:{
        current:-1,
        size:-1,
      },
      // 弹出层对象
      popupObj:{
        avatar:'',
        nickname:'',
        content:''
      },
      // 上拉加载配置
      upOption:{
        use: false,
      },
    }
  },
  onShow() {
    this.init()
  },
  computed: {
    ...mapGetters(['userInfo', 'token'])
  },
  methods: {
    ...mapActions(['mMsgNum','mInvitationNum']),
    init() {
      // 初始化websocket
      this.websocket()
      // 加载消息数据
      this.messageList()
    },
    // 滚动初始化
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 手机号脱敏
    format(val){
      return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },
    // 消息列表
    async messageList() {
      const result = await this.$api.messageList()
      if (!result.success) {
        uni.$u.toast(result.message)
        return
      }
      const msgList = result.data
      this.msgList = msgList
      let msgNum = 0
      msgList.forEach(item=>{
        if(item.unread){
          msgNum += item.unread
        }
      })
      this.mMsgNum(msgNum)
      // 设置脚标
      this.barNum(1, msgNum)
    },
    // tab-barNum
    barNum(index, num){
      if(num){
        // 处理消息红标badge
        uni.setTabBarBadge({
          // 下标
          index: 0,
          //数字
          text: num + ''
        })
      }else{
        uni.removeTabBarBadge({ //隐藏数字标
          index: index,
        })
      }
    },
    // Websocket订阅
    async websocket() {
      // 获取用户userId
      const userId = this.userInfo.id
      const username = this.userInfo.username
      // simple-Websocket订阅，用于好友聊天
      await this.simpleSubscribe(userId)
      // topic-Websocket订阅，用于群组聊天
      await this.topicSubscribe(userId)
      // invitation-Websocket订阅，用于好友邀请
      await this.invitationSubscribe(userId)
      // socket链接
      this.socketConnect(username)
    },
    // 单聊消息订阅
    simpleSubscribe(userId) {
      // 单点消息订阅
      const subscribeUrl = `/simple/message/${userId}`
      let _this = this
      const friendMsgRoute = this.$config.friendMsgUrl
      this.$ws.subscribes[subscribeUrl] = {
        callback: function (res) {
          console.log(`${userId}的subscribes消息为=`, res)
          let body = res.body
          body = body.replace(/\"fromUserId\":(\d+)/, '"fromUserId": "$1"')
          body = JSON.parse(body)
          // 获取当前打开过的页面路由数组
          let currentRoutes = getCurrentPages()
          let currentRoute = currentRoutes[currentRoutes.length - 1].route //获取当前页面路由
          if (friendMsgRoute == currentRoute) {
            // 证明在聊天页，则需要实时消息推送
            _this.$EventBus.$emit("friendMsgBus", res.body)
          } else {
            // 加载消息数据
            _this.messageList()
            // 获取平台信息
            const { platform } = uni.$u
            if(platform !== 'weixin'){
              // 处理弹出消息框
              _this.popupData(body)
              // 消息提示弹出
              _this.popupShow = true
            }
            _this.vibrateLong()
            // 延迟关闭提醒框
            _this.popupClose()
          }
        }
      }
      // msgHandle-Websocket订阅，用于消息操作如撤销/删除
      this.msgHandle(userId)
    },
    // 群组消息订阅
    async topicSubscribe(userId) {
      const _this = this
      const groupMsgRoute = this.$config.groupMsgUrl
      // 群组消息订阅
      let params = {
        current: -1,
        size: -1,
        userId: userId
      }
      const res = await this.$api.groupPage(params)
      if (!res.success) {
        return
      }
      const groupList = res.data.records
      groupList.forEach(item => {
        const groupId = `${item.id}`
        const subscribeUrl = `/topic/message/${groupId}`
        _this.$ws.subscribes[subscribeUrl] = {
          callback: function (res) {
            let body = `${res.body}`
            // 处理精度丢失问题
            body = body.replace(/\"groupId\":(\d+)/, '"groupId": "$1"')
            body = JSON.parse(body)
            if(userId == body.fromUserId){
              return
            }
            console.log(`${groupId}的subscribes消息为=`, res)
            // 获取当前打开过的页面路由数组
            let currentRoutes = getCurrentPages()
            let currentRoute = currentRoutes[currentRoutes.length - 1].route //获取当前页面路由
            if (groupMsgRoute == currentRoute) {
              // 证明在聊天页，则需要实时消息推送
              _this.$EventBus.$emit("groupMsgBus", res.body)
            } else {
              // 加载消息数据
              _this.messageList()
              // 获取平台信息
              const { platform } = uni.$u
              if(platform !== 'weixin'){
                // 处理弹出消息框
                _this.popupData(body)
                // 消息提示弹出
                _this.popupShow = true
              }
              // 消息震动
              _this.vibrateLong()
              // 延迟关闭提醒框
              _this.popupClose()
            }
          }
        }
        // msgHandle-Websocket订阅，用于消息操作如撤销/删除
        _this.msgHandle(groupId)
      })
    },
    // 延迟关闭提醒框
    popupClose(){
      const _this = this
      setTimeout(()=>{
        _this.popupShow = false
      },5000)
    },
    // 消息提示数据整理
    async popupData(body){
      const {source, fromUserId, msgContent, groupId} = body
      if(source==0){
        // 好友
        const result = await this.$api.friendDetail(fromUserId)
        const data = result.data
        let popupObj = this.popupObj
        popupObj.avatar = data.avatar
        popupObj.nickname = data.nickname
        popupObj.content = msgContent
        popupObj.source = source
        popupObj.targetId = fromUserId
      }else{
        // 群组
        const result = await this.$api.groupDetail(groupId)
        const data = result.data
        let popupObj = this.popupObj
        popupObj.avatar = data.avatar
        popupObj.nickname = data.name
        popupObj.content = msgContent
        popupObj.source = source
        popupObj.targetId = groupId
      }
    },
    // 跳转具体聊天页
    toMessage(){
      const target = {
        source: this.popupObj.source,
        targetId: this.popupObj.targetId,
        nickname: this.popupObj.nickname
      }
      this.toChat(target)
      this.popupShow = false
    },
    // 订阅邀请相关处理
    invitationSubscribe(userId){
      // 邀请消息订阅
      const subscribeUrl = `/invitation/message/${userId}`
      let _this = this
      this.$ws.subscribes[subscribeUrl] = {
        callback: function (res) {
          console.log(`${userId}的subscribes消息为=`, res)
          const value = res.body
          _this.mInvitationNum(value)
          // 设置脚标
          _this.barNum(2, value)
        }
      }
    },
    // 订阅消息相关处理
    msgHandle(targetId){
      const _this = this
      const groupMsgRoute = this.$config.groupMsgUrl
      const friendMsgRoute = this.$config.friendMsgUrl
      const subscribeUrl = `/msgHandle/message/${targetId}`
      _this.$ws.subscribes[subscribeUrl] = {
        callback: function (res) {
          console.log(`${targetId}的subscribes消息为=`, res)
          let currentRoutes = getCurrentPages() // 获取当前打开过的页面路由数组
          let currentRoute = currentRoutes[currentRoutes.length - 1].route //获取当前页面路由
          if (groupMsgRoute == currentRoute || friendMsgRoute == currentRoute) {
            // 证明在聊天页，则需要实时更新撤退/删除消息
            _this.$EventBus.$emit("msgHandleBus", res.body)
          }
        }
      }
    },
    // socket连接
    socketConnect(username) {
      this.$ws.connect(this.token, username)
    },
    // 弹出层关闭
    close() {
      this.popupShow = false
    },
    // 消息震动
    vibrateLong(){
      uni.vibrateLong({	success: function () {console.log('success')	}})
    },
    // 跳转聊天页
    toChat(params) {
      const source = params.source
      if(source){
        this.$Router.push({path: '/pages/msg/groupMsg', query: {groupId: params.targetId, nickname: params.targetName}})
      }else{
        this.$Router.push({path: '/pages/msg/friendMsg', query: {friendId: params.targetId, nickname: params.targetName}})
      }
    },
    // 格式化时间
    formatTime(oldValue) {
      let endTime = this.$moment(oldValue).format("HH:mm")
      const diff = this.$moment().diff(oldValue, 'seconds')
      if (diff > 300) {
        endTime = this.$moment(oldValue).fromNow()
      }
      return endTime
    },
    // 展示搜索所有用户
    showSearch(){
      // 搜索系统所有用户
      this.searchShow = true
    },
    // 跳转好友列表
    toFriend(item){
      this.$Router.push({ path: '/pages/friend/info', query: {friendId:item.id}})
    },
    // 搜索
    async change(e){
      if(!e){
        this.userList = []
        return
      }
      // 不分页查询
      let params = {
        ...this.baseParams,
        username:e
      }
      const result = await this.$api.userList(params)
      if (!result.success) {
        uni.$u.toast(result.message)
        return
      }
      this.userList = result.data.records
    },
    // 取消
    cancel(){
      this.searchShow = false
    },
    // 下拉刷新
    downCallback(){
      // 下拉重置
      this.init();
      // 下拉回调
      this.mescroll.endSuccess();
    },
    // 格式化展示文字
    formatLabel(item) {
      let label = ""
      const msgType = item.msgType
      switch (msgType) {
        case 2:
          label = item.source == 0 ? '[图片]' : item.nickname + ':' + '[图片]'
          break
        case 3:
          label = item.source == 0 ? '[语音]' : item.nickname + ':' + '[语音]'
          break
        case 4:
          label = item.source == 0 ? '[视频]' : item.nickname + ':' + '[视频]'
          break
        default:
          label = item.source == 0 ? item.lastContent : item.nickname + ':' + item.lastContent
      }
      return label
    },
  }
}
</script>

<style lang="scss">
.index{
  width: 100%;
}

.popup {
  --borderWidth: 3px;
  background: #1D1F20;
  position: relative;
  border-radius: var(--borderWidth);
}
.popup:after {
  content: '';
  position: absolute;
  top: calc(-1 * var(--borderWidth));
  left: calc(-1 * var(--borderWidth));
  height: calc(100% + var(--borderWidth) * 2);
  width: calc(100% + var(--borderWidth) * 2);
  background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
  border-radius: calc(2 * var(--borderWidth));
  z-index: -1;
  animation: animatedgradient 3s ease alternate infinite;
  background-size: 300% 300%;
}
@keyframes animatedgradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

::v-deep .u-cell__body__content{
	max-width: 82%!important;
}
::v-deep .u-cell__title{
	max-width: 82%!important;
}
::v-deep .u-cell__label{
	overflow: hidden!important;
	text-overflow: ellipsis!important;
	white-space: nowrap!important;
}
</style>
