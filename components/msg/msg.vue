<template>
  <view>
    <view class="msg" v-if="msgType==0 && (status!=2 || position=='right')">
      <view class="content" :class="type" v-if="status==0">
        <u--text size="12" :text="content"></u--text>
      </view>
      <view class="content" style="margin: 0 auto; padding: 0" v-if="status==1">
        <u--text size="12" type="primary" :text="position=='left'?(source==0?'对方': nickname) + '已撤回消息':'您已撤回消息,重新编辑'" @click="reEdit"></u--text>
      </view>
      <view class="content" style="margin: 0 auto; padding: 0" v-if="status==2">
        <u--text size="12" type="primary" :text="'您已删除消息,点击可查看'" @click="reView"></u--text>
      </view>
    </view>
    <view class="msg" :class="position" v-else>
      <u-avatar :src="avatar" size="40" @click="friendInfo"></u-avatar>
      <view class="content" :class="[status!=2?type:'']" >
        <view v-if="msgType==1 || status==2">
          <u-tooltip :text="content" v-if="position=='right'" :buttons="['撤回','删除']" @click="tooltip"></u-tooltip>
          <u-tooltip :text="content" v-else></u-tooltip>
        </view>
        <view v-if="msgType==2">
          <u--image :showLoading="true" :src="content" width="80px" height="80px" @click="imgPreview" @load="ready"></u--image>
        </view>
        <view v-if="msgType==3" :class="{'play':playClass,'right':position=='left'}"  @click="play">
          <view class="icon icon-chat-yuyinyou iconfont" v-if="position=='left'" ></view>
          <view class="time">{{ time }} </view>
          <view class="icon icon-chat-yuyinyou iconfont" v-if="position=='right'" ></view>
        </view>
        <view v-if="msgType==4" class="video">
          <u-parse :content="formatVideo(content)"></u-parse>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 播放语音相关参数
      AUDIO: uni.createInnerAudioContext(),
      // 语音播放样式
      playClass: false
    }
  },
  props: {
    // 位置 left/right
    position: {
      type: String,
      required: true,
      default: "right"
    },
    // 消息类型 0-系统 1-文字 2-图片 3-语音 4-视频
    msgType: {
      type: Number,
      required: true,
      default: 1
    },
    // 内容
    content: {
      type: String,
      required: true,
      default:''
    },
    // 目标Id
    targetId: {
      type: String,
      required: true,
      default:''
    },
    // 消息Id
    msgId: {
      type: String,
      default:''
    },
    // 昵称
    nickname: {
      type: String,
      default:''
    },
    // 来源 0-朋友 1-群组
    source: {
      type: String,
      default:''
    },
    // 状态 0-正常;1-撤销;2-删除
    status: {
      type: Number,
      default: 0
    },
    // 头像
    avatar:{
      type: String,
      default:'/static/img/javadog.png'
    },
    // 语音时间
    time:{
      type: String,
      default:''
    }
  },
  computed:{
    // 消息类型
    type(){
      const msgType = this.msgType
      let type = ''
      switch (msgType) {
        case 0:
          type ='system'
          break
        case 1:
          type ='text'
        break
        case 2:
          type ='image'
          break
        case 3:
          type ='voice'
          break
        case 4:
          type ='video'
          break
      }
      return type
    }
  },
  mounted(){
    const _this = this
    this.AUDIO.onEnded(() => {
      debugger
      //播放结束
      _this.playClass = false
    })
  },
  methods: {
    // 转化视频
    formatVideo(content){
      return `<video src="${content}" controls="controls">您的浏览器不支持 video 标签。</video>`
    },
    // 加载完成执行
    ready(){
      this.$emit("parseReady")
    },
    // 图片预览
    imgPreview(){
      uni.previewImage({
        indicator:"number",
        loop:true,
        urls: [this.content]
      })
    },
    // 播放语音
    play(){
      console.log("播放中")
      this.playClass = true
      // 播放语音
      this.AUDIO.src = this.content
      this.$nextTick(function() {
        this.AUDIO.play()
      })
    },
    // 跳转好友信息页面
    friendInfo(){
      this.$emit("friendInfo", this.targetId)
    },
    // 长按事件
    tooltip(index){
      let msgHandle = {
        msgId: this.msgId,
        index: index
      }
      if(index==1 || index==2){
        this.$emit("msgHandle", msgHandle)
      }
    },
    // 重新编辑
    reEdit(){
      uni.setClipboardData({
        data: this.content ,
        success: function (res) {
          uni.$u.toast("已复制到剪切板")
        }
      })
    },
    // 恢复查看
    reView(){
      this.$emit("reView", this.msgId)
    }
  }
}
</script>

<style lang="scss" scoped>

.msg {
  margin-top: 20upx;
  background: #F5F5F5;
  padding: 0 20upx 0;
  display: flex;

  .content {
    padding: 16upx;
    max-width: 70%;
    min-height: 42upx;
    border-radius: 10upx;
    padding: 14upx 20upx;
    display: flex;
    align-items: center;
    font-size: 32upx;
    word-break: break-word;
  }
  .video{
    max-width: none;
  }
  .system{
    padding: 0 30upx;
    height: 52upx;
    line-height: 52rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #c9c9c9 !important;
    color: #fff !important;
    font-size: 12px;
    border-radius: 40upx;
    margin: 0 auto;
  }
}

.left {
  .content {
    margin-left: 12upx;
    background: #FFFFFF;
  }
}

.right {
  flex-direction: row-reverse;

  .content {
    margin-right: 12upx;
    background: #95EC69;
  }
}

.image, .video{
  background: transparent !important;
  padding: 0!important;
}

.voice{
  view{
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
  }
  .play{
    @keyframes my-play {
      0% {
        transform: translateX(80%);
      }
      100% {
        transform: translateX(0%);
      }
    }
    .icon:after
    {
      border-left: solid 10upx rgba(149,236,105,.5);
      animation: my-play 1s linear infinite;
    }

  }

  .play.right{
    .icon:after
    {
      border-left: solid 10upx rgba(255,255,255,.5);
      animation: my-play 1s linear infinite;
    }
  }
  .icon{
    font-size: 40upx;
    display: flex;
    align-items: center;
  }
  .icon:after
  {
    content:" ";
    width: 53upx;
    height: 53upx;
    border-radius: 100%;
    position: absolute;
    box-sizing: border-box;
  }
  .time{
    font-size: 28upx;
  }
}
::v-deep .u-tooltip__wrapper{
	white-space: break-spaces!important;
}

::v-deep .u-tooltip{
	display: block;
}

</style>
