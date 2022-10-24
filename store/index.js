import Vue from 'vue'
import Vuex from 'vuex'
import { ACCESS_TOKEN, USER_INFO} from "@/common/util/constants"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // token
    token: '',
    // 用户信息
    userInfo:{},
    // 消息总数
    msgNum:0,
    // 邀请总数
    invitationNum:0,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_MSG_NUM: (state, msgNum) => {
      state.msgNum = msgNum
    },
    SET_INVITATION_NUM: (state, invitationNum) => {
      state.invitationNum = invitationNum
    }

  },
  actions: {
    // 登录
    mLogin({ commit }, userInfo) {
		uni.setStorageSync(ACCESS_TOKEN,userInfo.token);
		uni.setStorageSync(USER_INFO,JSON.stringify(userInfo));
		commit('SET_TOKEN', userInfo.token)
        commit('SET_USERINFO', userInfo)
    },
    // 登出
    mLogout({ commit, state }) {
      return new Promise(() => {
        commit('SET_TOKEN', '')
        uni.removeStorageSync(ACCESS_TOKEN)
        uni.removeStorageSync(USER_INFO)
      })
    },
    // 消息总数
    mMsgNum({ commit }, msgNum) {
      commit('SET_MSG_NUM', msgNum)
    },
    // 邀请总数
    mInvitationNum({ commit }, invitationNum) {
      commit('SET_INVITATION_NUM', invitationNum)
    },

  },
  getters:{
    token: state => {
      state.token = uni.getStorageSync(ACCESS_TOKEN);
      return state.token
    },
    userInfo:state => {
      state.userInfo = JSON.parse(uni.getStorageSync(USER_INFO));
      return state.userInfo
    },
    msgNum:state => {
      return state.msgNum
    },
    invitationNum:state => {
      return state.invitationNum
    },
  }
})
