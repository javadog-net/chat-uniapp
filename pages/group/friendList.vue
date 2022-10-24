<template>
  <view>
    <navbar title="通讯录" back="false" @search="search" @change="change"></navbar>
    <view class="container">
      <u-checkbox-group
          v-model="friendArray"
          placement="column"
      >
        <u-index-list :indexList="indexList" style="padding-bottom: 140px">
          <template v-for="(item, index) in itemArr">
            <!-- #ifdef APP-NVUE -->
            <u-index-anchor :text="indexList[index]" :key="index"></u-index-anchor>
            <!-- #endif -->
            <u-index-item :key="index">
              <!-- #ifndef APP-NVUE -->
              <u-index-anchor :text="indexList[index]" v-if="item.length>0"></u-index-anchor>
              <!-- #endif -->
              <view class="list" v-for="(friend, index1) in item" :key="index1" @click="toInfo(friend)">
                <view class="list__item">
                  <u-checkbox
                      :disabled="groupUsers.includes(friend.friendId)"
                      :key="friend.friendId"
                      :name="friend.friendId"
                  ></u-checkbox>
                  <image class="list__item__avatar" :src="friend.avatar"></image>
                  <text class="list__item__user-name">{{ friend.nickname }}</text>
                </view>
                <u-line></u-line>
              </view>
            </u-index-item>
          </template>
        </u-index-list>
      </u-checkbox-group>
      <u-empty v-if="friendList.length==0" marginTop="200upx" mode="list"
               icon="http://cdn.uviewui.com/uview/empty/list.png">
      </u-empty>
      <view class="confirm"><u-button type="error" @click="confirm">确定</u-button></view>
    </view>
  </view>
</template>

<script>
import {
  mapGetters
} from "vuex"
// 数据归档
const indexList = () => {
  const indexList = []
  const charCodeOfA = 'A'.charCodeAt(0)
  indexList.push("↑")
  indexList.push("☆")
  for (let i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i))
  }
  indexList.push('#')
  return indexList
}
export default {
  data() {
    return {
      // 索引列表
      indexList: indexList(),
      // 好友列表
      friendList: [],
      // 勾选好友列表
      friendArray:[],
      // 群组好友信息
      groupUsers:[]
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    // 好友归组
    itemArr() {
      let _this = this
      const reg = /[^a-zA-Z]/
      return this.indexList.map(item => {
        const arr = []
        // 递归进行分组
        const friendList = _this.friendList
        friendList.forEach(friend => {
          if (friend.alphabetic === item) {
            arr.push(friend)
          } else if (item == '#' && reg.test(friend.alphabetic)) {
            arr.push(friend)
          }
        })
        return arr
      })
    }
  },
  mounted() {
    let query = this.$Route.query
    this.groupId = query.groupId
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      await this.friendPage()
      await this.groupUser()
    },
    // 获取群组内成员
    async groupUser(){
      const res = await this.$api.groupDetail(this.groupId)
      if (res.success) {
        const groupUsers = res.data.groupUsers
        this.groupUsers = groupUsers.map(item=>{return item.userId})
      }
    },
    // 获取所有好友
    async friendPage(friendVo) {
      // 不分页查询
      let params = {
        current: -1,
        size: -1,
        ...friendVo
      }
      const res = await this.$api.friendPage(params)
      if (res.success) {
        this.friendList = res.data.records
      }
    },
    // 点击搜索
    search(val) {
      this.friendPage({nickname: val})
    },
    // 点击搜索取消
    change(val) {
      if (val) {
        this.search(val)
      } else {
        this.friendPage()
      }
    },
    // 跳转好友信息
    toInfo(friend) {
      this.$Router.push({path: '/pages/friend/info', query: {friendId: friend.friendId, nickname: friend.nickname}})
    },
    // 不同处理页面
    handle(index) {
      switch (index) {
        case 0:
          this.$Router.push({path: '/pages/invitation/add'})
          break
        case 1:
          this.$Router.push({path: '/pages/invitation/added'})
          break
      }
    },
    // 确定
    async confirm(){
      let friendArray = this.friendArray
      if(friendArray.length==0){
        uni.$u.toast("请选择要拉入的好友")
        return
      }
      let param = {
          groupId: this.groupId,
          userIds: friendArray.join(","),
      }
      const result = await this.$api.groupUserAdd(param)
      if (result.success) {
        uni.$u.toast("操作成功")
        this.$Router.push({path: '/pages/group/group'})
      }
    }
  }
}
</script>

<style lang="scss">
.list {

  &__item {
    @include flex;
    padding: 6px 12px;
    align-items: center;

    &__avatar {
      height: 35px;
      width: 35px;
      border-radius: 3px;
    }

    &__user-name {
      font-size: 16px;
      margin-left: 10px;
      color: $u-main-color;
    }
  }

  &__footer {
    color: $u-tips-color;
    font-size: 14px;
    text-align: center;
    margin: 15px 0;
  }
}

.confirm{
  position: fixed;
  bottom: 100upx;
  width: 100%;
}
</style>
