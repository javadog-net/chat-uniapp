<template>
  <view class="login">
    <view class="container">
      <!-- logo -->
      <view class="logo">
        <u-avatar src="/static/img/javadog.png" shape="square" size="100"></u-avatar>
      </view>
      <!-- title -->
      <view class="title">
        <h2>{{ title }}</h2>
      </view>
      <!-- 用户名密码表单 -->
      <view class="form">
        <u--form labelPosition="left" :model="model" :rules="rules" ref="loginForm" labelWidth="80">
          <u-form-item label="手机号" prop="user.username" borderBottom customStyle="margin-bottom: 10px">
            <u--input placeholder="请输入手机号" v-model="model.user.username" border="none"></u--input>
          </u-form-item>
          <u-form-item label="密码" prop="user.password" borderBottom customStyle="margin: 10px 0">
            <u--input placeholder="请输入密码" v-model="model.user.password" border="none" password clearable>
            </u--input>
          </u-form-item>
        </u--form>
        <u-button type="success" text="登录" customStyle="margin-top: 50px" shape="circle" @click="submit">
        </u-button>
      </view>
      <!-- 脚注功能 -->
      <view class="footer">
        <text class="footer-text" @click="retrieve">找回密码</text>
        <text class="footer-text" @click="register">账号注册</text>
        <text class="footer-text" @click="suggest">投诉建议</text>
      </view>
    </view>
    <!--找回密码-->
    <u-modal
        :asyncClose="true"
        title="找回密码"
        :show="modalShow"
        closeOnClickOverlay
        showCancelButton
        @close="() => modalShow = false"
    >
      <view class="slot-content" style="width: 100%">
        <u-alert title="密码将发送至您个人信息中绑定的邮箱" type="info" :show-icon="true"></u-alert>
        <u--input
            style="margin-top: 10px"
            placeholder="请输入账号"
            border="surround"
            v-model="retrievePwd.username"
        ></u--input>
        <u--input
            style="margin-top: 10px"
            placeholder="请输入邮箱"
            border="surround"
            v-model="retrievePwd.email"
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
  mapActions
} from "vuex"

export default {
  data() {
    return {
      // 标题
      title: 'JavaDog Chat',
      // 找回密码modal显示与否
      modalShow: false,
      // 找回密码
      retrievePwd:{
        // 用户名
        username:'',
        // 邮箱
        email:''
      },
      model: {
        // 用户对象
        user: {
          username: '',
          password: '',
        },
      },
      rules: {
        'user.username': [{
          required: true,
          message: '请输入手机号',
          trigger: ['change', 'blur'],
        },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.mobile(value)
            },
            message: '手机号码不正确',
            trigger: ['blur'],
          }
        ],
        'user.password': [{
          type: 'string',
          min: 6,
          max: 16,
          required: true,
          message: '请输入6-16位密码',
          trigger: ['blur']
        }],
      }
    }
  },
  onLoad() {

  },
  methods: {
    ...mapActions(["mLogin"]),
    // 登录提交
    submit() {
      this.$refs.loginForm.validate().then(async res => {
        let param = this.model.user
        const result = await this.$api.login(param)
        if (result.success) {
          this.mLogin(result.data)
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }else{
          this.$tips.error(result.message)
        }
      }).catch(errors => {
        return
      })
    },
    // 账号注册
    register() {
      uni.reLaunch({
        url: '/pages/register/index'
      })
    },
    // 投诉建议
    suggest(){
      uni.$u.toast("我想爱她更久一些")
    },
    // 找回密码
    retrieve(){
      this.modalShow = true
    },
    // 密码重置
    async reset(){
      if(!this.retrievePwd.username || !this.retrievePwd.email){
        uni.$u.toast("请输入用户名及邮箱!")
        return
      }
      const result = await this.$api.retrieve(this.retrievePwd)
      if (result.success) {
        uni.$u.toast("操作成功,等待邮件")
        this.modalShow = false
      }else{
        uni.$u.toast(result.message)
      }
    }
  }
}
</script>

<style lang="scss">
.login {
  .container {
    background: #fff;
    width: 100vw;
    padding-top: 10vh;
    // #ifndef H5
    height: 90vh;
    // endif


    .logo {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      width: 100vw;
    }

    .title {
      text-align: center;
      margin-top: 40rpx;
    }

    .form {
      padding: 0 60rpx;
      margin-top: 80rpx;
    }

    .footer {
      flex-direction: row;
      justify-content: center;
      text-align: center;
      align-items: center;
      margin-top: 80rpx;

      .footer-text {
        font-size: 28rpx;
        color: #296db5;
        padding: 30rpx;
      }
    }
  }
}
</style>
