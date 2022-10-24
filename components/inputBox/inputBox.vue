<template>
  <view>
    <!-- 抽屉栏 -->
    <view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
      <!-- 表情 -->
      <swiper class="slider" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
        <swiper-item v-for="(item, key) in emojiData" :key="key" class="slider-emoji" >
          <u-row customStyle="flex-wrap: wrap;">
            <u-col span="1.5" v-for="(emoji, index) in item" customStyle="align-items: center;padding: 5px">
              <text :key="index" @click="selEmoji(emoji)" size="20" class="slider-emoji-icon" style="font-size: 20px">{{ emoji }}</text>
            </u-col>
          </u-row>
        </swiper-item>
      </swiper>
      <!-- 更多功能 相册-拍照 -->
      <view class="more-layer" :class="{hidden:hideMore}">
        <view class="list">
          <view class="box" @tap="getImage('album')">
            <view class="iconfont icon-chat-image" style="font-size: 40px"></view>
          </view>
          <view class="box" @tap="getImage('camera')">
            <view class="iconfont icon-chat-camera-fill" style="font-size: 40px"></view>
          </view>
          <view class="box" @tap="getVideo('video')">
            <view class="iconfont icon-chat-video-fill" style="font-size: 40px"></view>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部输入栏 -->
    <view class="input-box cu-bar tabbar" :class="popupLayerClass" @touchmove.stop.prevent="discard">
      <!-- H5下不能录音，输入栏布局改动一下 -->
      <!-- #ifndef H5 -->
      <view class="voice">
        <view class="iconfont" style="color:#000; font-size: 28px" :class="isVoice?'icon-chat-jianpan':'icon-chat-yuyin'" @tap="switchVoice"></view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="more" @tap="showMore">
        <view style="font-size: 30px" class="iconfont icon-chat-plus-circle"></view>
      </view>
      <!-- #endif -->
      <view class="textbox" :class="isVoice?'v':'t'">
        <!--语音模式-->
        <view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']"
              @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd"
              @touchcancel="voiceCancel">{{ voiceTis }}
        </view>
        <!--文字模式-->
        <view class="text-mode" :class="isVoice?'hidden':''">
          <view class="box">
            <textarea auto-height="true" v-model="textMsg" @focus="textareaFocus"/>
          </view>
          <view class="em" @tap="chooseEmoji">
            <view style="font-size: 30px" class="iconfont icon-chat-smile"></view>
          </view>
        </view>
      </view>
      <!-- #ifndef H5 -->
      <view class="more" @tap="showMore">
        <view style="font-size: 30px" class="iconfont icon-chat-plus-circle"></view>
      </view>
      <!-- #endif -->
      <view class="send" :class="isVoice?'hidden':''" @tap="sendText">
        <view class="btn">发送</view>
      </view>
    </view>
    <!-- 录音UI效果 -->
    <view class="record" :class="recording?'':'hidden'">
      <view class="ing" :class="willStop?'hidden':''">
        <view class="iconfont icon-chat-record-sound"></view>
      </view>
      <view class="cancel" :class="willStop?'':'hidden'">
        <view class="iconfont icon-chat-yuyinchehui"></view>
      </view>
      <view class="tis" :class="willStop?'change':''">{{ recordTis }}</view>
    </view>
  </view>
</template>

<script>
import emoji from "@/common/util/emoji";
import ws from '@/common/websocket/ws.js'
export default {
  data() {
    return {
      // 表情数据
      emojiData:[],
      // 文字消息
      textMsg: '',
      // 滚动动画
      scrollAnimation: false,
      // 滚动距离
      scrollTop: 0,
      //录音相关参数
      // #ifndef H5
      //H5不能录音
      RECORDER: uni.getRecorderManager(),
      // #endif
      // 是否展示语音
      isVoice: false,
      // 语音提示
      voiceTis: '按住 说话',
      // 取消发送提示
      recordTis: "手指上滑 取消发送",
      // 录音状态
      recording: false,
      // 停止状态
      willStop: false,
      // 初始状态
      initPoint: {
        identifier: 0,
        Y: 0
      },
      // 录音时间
      recordTimer: null,
      // 录音长度
      recordLength: 0,
      //播放语音相关参数
      AUDIO: uni.createInnerAudioContext(),
      // 抽屉参数
      popupLayerClass: '',
      // more参数
      hideMore: true,
      //表情定义
      hideEmoji: true,
    }
  },
  props: {},
  mounted(){
    // 调用初始化
    this.init()
    // #ifndef H5
    //录音开始事件
    this.RECORDER.onStart((e) => {
      this.recordBegin(e)
    })
    //录音结束事件
    this.RECORDER.onStop((e) => {
      this.recordEnd(e)
    })
    // #endif
  },
  methods: {
    // 总初始化方法
    init(){
      this.initEmoji()
    },
    // 初始化表情
    initEmoji(){
      let emojiData = []
      for (let i = 0; i < 4; i++) {
        emojiData[i] = [];
        for (let k = 0; k < 32; k++) {
          emoji[i*5+k]?emojiData[i].push(
              emoji[i*5+k]
          ):''
        }
      }
      this.emojiData = emojiData
    },
    // 选择表情
    selEmoji(emoji) {
      this.textMsg = this.textMsg + emoji
    },
    // 更多功能(点击+弹出)
    showMore() {
      this.isVoice = false
      this.hideEmoji = true
      if (this.hideMore) {
        this.hideMore = false
        this.openDrawer()
      } else {
        this.hideDrawer()
      }
    },
    // 打开抽屉
    openDrawer() {
      this.popupLayerClass = 'showLayer'
    },
    // 隐藏抽屉
    hideDrawer() {
      this.popupLayerClass = ''
      setTimeout(() => {
        this.hideMore = true
        this.hideEmoji = true
      }, 150)
    },
    // 选照片/拍照
    getImage(type) {
      const _this = this
      _this.hideDrawer()
      uni.chooseImage({
        sourceType: [type],
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        success: (res) => {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            uni.getImageInfo({
              src: res.tempFilePaths[i],
              success: (image) => {
                let msg = {
                  url: res.tempFilePaths[i],
                  w: image.width,
                  h: image.height,
                  msgType:2,
                }
                _this.$emit("sendMsg",msg)
              }
            })
          }
        }
      })
    },
    // 选视频或者拍视频
    getVideo(){
      const _this = this
      _this.hideDrawer()
      uni.chooseVideo({
        sourceType: ['camera', 'album'],
        success: function (res) {
          let msg = {
            url: res.tempFilePath,
            msgType:4,
          }
          _this.$emit("sendMsg",msg)
        }
      })
    },
    // 选择表情
    chooseEmoji() {
      this.hideMore = true
      if (this.hideEmoji) {
        this.hideEmoji = false
        this.openDrawer()
      } else {
        this.hideDrawer()
      }
    },
    //添加表情
    addEmoji(em) {
      this.textMsg += em.alt
    },
    //获取焦点，如果不是选表情ing,则关闭抽屉
    textareaFocus() {
      if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
        this.hideDrawer()
      }
    },
    // 发送文字消息
    sendText() {
      // 隐藏抽屉
      this.hideDrawer()
      if (!this.textMsg) {
        return
      }
      let msg = {
        msgContent: this.textMsg,
        msgType:1
      }
      //清空输入框
      this.textMsg = ''
      this.$emit("sendMsg",msg)
    },
    // 录音开始
    voiceBegin(e) {
      if (e.touches.length > 1) {
        return
      }
      uni.vibrateLong({	success: function () {console.log('success')	}})
      this.initPoint.Y = e.touches[0].clientY
      this.initPoint.identifier = e.touches[0].identifier
      console.log("this.RECORDER", this.RECORDER)
      this.RECORDER.start({
        format: "mp3"
      }) //录音开始,
    },
    //录音开始UI效果
    recordBegin(e) {
      this.recording = true
      this.voiceTis = '松开 结束'
      this.recordLength = 0
      this.recordTimer = setInterval(() => {
        this.recordLength++
      }, 1000)
    },
    // 录音被打断
    voiceCancel() {
      console.log("voiceCancel")
      this.recording = false
      this.voiceTis = '按住 说话'
      this.recordTis = '手指上滑 取消发送'
      // 不发送录音
      this.willStop = true
      // 录音结束
      this.RECORDER.stop()
    },
    // 录音中(判断是否触发上滑取消发送)
    voiceIng(e) {
      if (!this.recording) {
        return
      }
      let touche = e.touches[0]
      //上滑一个导航栏的高度触发上滑取消发送
      if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
        this.willStop = true
        this.recordTis = '松开手指 取消发送'
      } else {
        this.willStop = false
        this.recordTis = '手指上滑 取消发送'
      }
    },
    // 结束录音
    voiceEnd() {
      if (!this.recording) {
        return
      }
      this.recording = false
      this.voiceTis = '按住 说话'
      this.recordTis = '手指上滑 取消发送'
      //录音结束
      this.RECORDER.stop()
    },
    //录音结束(回调文件)
    recordEnd(e) {
      clearInterval(this.recordTimer)
      if (!this.willStop) {
        console.log("e: " + JSON.stringify(e))
        let msg = {
          time: 0,
          url: e.tempFilePath,
          msgType:3,
        }
        let min = parseInt(this.recordLength / 60)
        let sec = this.recordLength % 60
        min = min < 10 ? '0' + min : min
        sec = sec < 10 ? '0' + sec : sec
        msg.time = min + ':' + sec
        console.log("input-msg",JSON.stringify(msg))
        this.$emit("sendMsg",msg)
      } else {
        console.log('取消发送录音')
      }
      this.willStop = false
    },
    // 切换语音/文字输入
    switchVoice() {
      this.hideDrawer()
      this.isVoice = this.isVoice ? false : true
    },
    // touchmove
    discard() {
      return
    }
  }
}
</script>

<style lang="scss">
.hidden{
  display: none !important;
}
.popup-layer{
  &.showLayer{transform: translate3d(0,-43vw,0);}
  transition: all .15s linear;
  width: 100%;
  height: 42vw;
  padding: 20upx 2%;
  background-color: #f3f3f3;
  border-top: solid 1upx #ddd;
  position: fixed;
  z-index: 20;
  top: 100%;
  .emoji-swiper{
    height: 40vw;
    swiper-item{
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      view{
        width: 12vw;
        height: 12vw;
        display: flex;
        justify-content: center;
        align-items: center;
        image{
          width: 8.4vw;
          height: 8.4vw;
        }
      }
    }
  }
  .more-layer{
    width: 100%;
    height: 42vw;
    .list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .box{
        width: 18vw;
        height: 18vw;
        border-radius: 20upx;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 3vw 2vw 3vw;
        .icon{
          font-size: 70upx;
        }
      }
    }
  }
}
.input-box{
  width: 750upx;
  min-height: 100upx;
  background-color: #f2f2f2;
  display: flex;
  position: fixed;
  z-index: 20;
  bottom:-2upx;
  &.showLayer{transform: translate3d(0,-43vw,0);}
  transition: all .15s linear;
  border-bottom: solid 1upx #ddd;
  .voice,.more{
    flex-shrink: 0;
    width: 90upx;
    height: 100upx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .send{
    //H5发送按钮左边距
    /* #ifdef H5 */
    margin-left: 20upx;
    /* #endif */
    flex-shrink: 0;
    width: 100upx;
    height: 100upx;
    display: flex;
    align-items: center;
    .btn{
      width: 90upx;
      height: 56upx;
      display: flex;
      justify-content: center;
      align-items: center;
      background:linear-gradient(to right,#5ac725,#53c21d);
      color: #fff;
      border-radius: 6upx;
      font-size: 24upx;
    }
  }
  .textbox{
    min-height: 70upx;
    flex-shrink: 0;
    // #ifdef MP
    width: 460upx;
    // #endif
    // #ifdef H5
    width: 530upx;
    // #endif
    // #ifdef APP-PLUS
    width: 460upx;
    // #endif

    display: flex;
    justify-content: center;
    align-items: center;
    // margin-top: 15upx;
    .voice-mode{
      // #ifdef MP
      width: calc(650upx - 2upx);
      // #endif
      // #ifdef H5
      width: calc(100% - 2upx);
      // #endif
      // #ifdef APP-PLUS
      width: calc(650upx - 2upx);
      // #endif
      height: 68upx;
      border-radius: 70upx;
      border:solid 1upx #cdcdcd;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28upx;
      background-color: #fff;
      color: #555;
      &.recording{
        background-color: #e5e5e5;
      }
    }
    .text-mode{
      width: 100%;
      min-height: 70upx;
      display: flex;
      background-color: #fff;
      border-radius: 40upx;
      .box{
        width: 100%;
        padding-left: 30upx;
        min-height: 70upx;
        display: flex;
        align-items: center;
        textarea{
          width: 100%;
        }
      }
      .em{
        flex-shrink: 0;
        width: 80upx;
        padding-left: 10upx;
        height: 70upx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .v{
    // #ifndef h5
    width: 560upx;
    // #endif
  }
}
.record{
  width: 40vw;
  height: 40vw;
  position: fixed;
  top: 55%;
  left: 30%;
  background-color: rgba(0,0,0,.6);
  border-radius: 20upx;
  .ing{
    width: 100%;
    height: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
    // 模拟录音音效动画
    @keyframes volatility {
      0% {background-position: 0% 130%;}
      20% {background-position: 0% 150%;}
      30% {background-position: 0% 155%;}
      40% {background-position: 0% 150%;}
      50% {background-position: 0% 145%;}
      70% {background-position: 0% 150%;}
      80% {background-position: 0% 155%;}
      90% {background-position: 0% 140%;}
      100% {background-position: 0% 135%;}
    }
    .iconfont{
      background-image:linear-gradient(to bottom,#f09b37,#fff 50%);
      background-size:100% 200%;
      animation: volatility 1.5s ease-in-out -1.5s infinite alternate;
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      font-size: 150upx;
      color: #f09b37;
    }
  }
  .cancel{
    width: 100%;
    height: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont{
      color: #fff;
      font-size: 150upx;
    }
  }
  .tis{
    width: 100%;
    height: 10vw;
    display: flex;
    justify-content: center;
    font-size: 28upx;
    color: #fff;
    &.change{
      color: #f09b37;
    }
  }
}
.content{
  width: 100%;
  .msg-list{
    width: 100%;
    padding: 0 2%;
    position: absolute;
    top: 0;
    bottom: 100upx;
    padding-bottom: calc(env(safe-area-inset-bottom) / 2);
    .loading{
      //loading动画
      display: flex;
      justify-content: center;
      @keyframes stretchdelay {
        0%, 40%, 100% {
          transform: scaleY(0.6);
        }
        20% {
          transform: scaleY(1.0);
        }
      }
      .spinner {
        margin: 20upx 0;
        width: 60upx;
        height: 100upx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        view {
          background-color: #f06c7a;
          height: 50upx;
          width: 6upx;
          border-radius: 6upx;
          animation: stretchdelay 1.2s infinite ease-in-out;
        }
        .rect2 {
          animation-delay: -1.1s;
        }
        .rect3 {
          animation-delay: -1.0s;
        }
        .rect4 {
          animation-delay: -0.9s;
        }
        .rect5 {
          animation-delay: -0.8s;
        }
      }
    }
    .row{
      .system{
        display: flex;
        justify-content: center;
        view{
          padding: 0 30upx;
          height: 50upx;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #c9c9c9;
          color: #fff;
          font-size: 24upx;
          border-radius: 40upx;
        }
        .red-envelope{
          image{
            margin-right: 5upx;
            width: 30upx;
            height: 30upx;
          }
        }
      }
      &:first-child{
        margin-top: 20upx;
      }
      padding: 20upx 0;
      .my .left,.other .right{
        width: 100%;
        display: flex;
        .bubble{
          max-width: 70%;
          min-height: 50upx;
          border-radius: 10upx;
          padding: 15upx 20upx;
          display: flex;
          align-items: center;
          font-size: 32upx;
          word-break: break-word;
          &.img{
            background-color: transparent;
            padding:0;
            overflow: hidden;
            image{
              max-width: 350upx;
              max-height: 350upx;
            }
          }
          &.red-envelope{
            background-color: transparent;
            padding:0;
            overflow: hidden;
            position: relative;
            justify-content: center;
            align-items: flex-start;
            image{
              width: 250upx;
              height: 313upx;
            }
            .tis{
              position: absolute;
              top: 6%;
              font-size: 26upx;
              color: #9c1712;
            }
            .blessing{
              position: absolute;
              bottom: 14%;
              color: #e9b874;
              width: 80%;
              text-align: center;
              overflow: hidden;
              // 最多两行
              display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;
            }
          }
          &.voice{
            .iconfont{
              font-size: 40upx;
              display: flex;
              align-items: center;
            }
            .iconfont:after
            {
              content:" ";
              width: 53upx;
              height: 53upx;
              border-radius: 100%;
              position: absolute;
              box-sizing: border-box;
            }
            .length{
              font-size: 28upx;
            }
          }
        }
      }
      .my .right,.other .left{
        flex-shrink: 0;
        width: 80upx;
        height: 80upx;
        image{
          width: 80upx;
          height: 80upx;
          border-radius: 10upx;
        }
      }
      .my{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .left{
          min-height: 80upx;

          align-items: center;
          justify-content: flex-end;
          .bubble{
            background-color: #f06c7a;
            color: #fff;

            &.voice{
              .icon{
                color: #fff;
              }
              .length{
                margin-right: 20upx;
              }
            }
            &.play{
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
                border-left: solid 10upx rgba(240,108,122,.5);
                animation: my-play 1s linear infinite;
              }
            }
          }
        }
        .right{
          margin-left: 15upx;
        }
      }
      .other{
        width: 100%;
        display: flex;
        .left{
          margin-right: 15upx;
        }
        .right{
          flex-wrap: wrap;
          .username{
            width: 100%;
            height: 45upx;
            line-height: 30upx;
            font-size: 24upx;
            color: #999;
            display: flex;
            .name{
              margin-right: 50upx;
            }
          }
          .bubble{
            background-color: #fff;
            color: #333;
            &.voice{
              .icon{
                color: #333;

              }
              .length{
                margin-left: 20upx;
              }
            }
            &.play{
              @keyframes other-play {
                0% {
                  transform: translateX(-80%);
                }
                100% {
                  transform: translateX(0%);
                }
              }
              .icon:after
              {
                border-right: solid 10upx rgba(255,255,255,.8);

                animation: other-play 1s linear infinite;
              }
            }
          }
        }
      }
    }
  }
}
.windows{

  .mask{
    position: fixed;
    top: 100%;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0,0,0,.6);
    opacity: 0;
    transition: opacity .2s ease-out;
  }
  .layer{
    position: fixed;
    width: 80%;
    height: 70%;
    left: 10%;
    z-index: 1001;
    border-radius: 20upx;
    overflow: hidden;
    top:100%;
    transform: scale3d(.5,.5,1);
    transition: all .2s ease-out;
  }
  &.show{
    display: block;
    .mask{
      top: 0;
      opacity: 1;
    }
    .layer{
      transform: translate3d(0,-85vh,0) scale3d(1,1,1);
    }
  }
  &.hide{
    display: block;
    .mask{
      top: 0;
      opacity: 0;
    }
    .layer{
      //transform: translate3d(0,-85vh,0) scale3d(.5,.5,1);
    }
  }
}
.open-redenvelope{
  width: 100%;
  height: 70vh;
  background-color: #cf3c35;
  position: relative;
  .top{
    width: 100%;
    background-color: #fe5454;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    border-radius: 0 0 100% 100%;
    box-shadow: inset 0 -20upx 0 #9c1712;
    .close-btn{
      width: 100%;
      height: 80upx;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30upx;
      .icon{
        color: #9c1712;
        margin-top: 10upx;
        margin-right: 10upx;
      }
    }
    image{
      width: 130upx;
      height: 130upx;
      border: solid 12upx #cf3c35;
      border-radius: 100%;

      margin-bottom: -65upx;
    }
    margin-bottom: 65upx;
  }
  .from,.blessing,.money,.showDetails{
    width: 100%;
    padding: 5upx 5%;
    display: flex;
    justify-content: center;
    font-size: 32upx;
    color: #fff;
  }
  .money{
    font-size: 100upx;
    color: #f8d757;
    display: flex;
    padding-top: 20upx;
  }
  .showDetails{
    position: absolute;
    bottom: 20upx;
    align-items: center;
    font-size: 28upx;
    color: #f8d757;
    .icon{
      font-size: 26upx;
      color: #f8d757;
    }
  }
}
</style>
