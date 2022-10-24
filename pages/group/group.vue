<template>
  <view>
    <navbar title="群组" back="false" @search="search" @change="change"></navbar>
    <u-index-list :indexList="indexList">
      <view slot="header" class="list">
        <view class="list__item" @click="add">
          <u-avatar shape="square" size="35" icon="man-add-fill" fontSize="26" randomBgColor></u-avatar>
          <text class="list__item__user-name">新建群组</text>
        </view>
        <u-line></u-line>
      </view>
      <template v-for="(item, index) in itemArr">
        <!-- #ifdef APP-NVUE -->
        <u-index-anchor :text="indexList[index]" :key="index"></u-index-anchor>
        <!-- #endif -->
        <u-index-item :key="index">
          <!-- #ifndef APP-NVUE -->
          <u-index-anchor :text="indexList[index]" v-if="item.length>0"></u-index-anchor>
          <!-- #endif -->
          <view class="list" v-for="(group, index1) in item" :key="index1" @click="toInfo(group)">
            <view class="list__item">
              <image class="list__item__avatar" :src="group.avatar"></image>
              <text class="list__item__user-name">{{group.name}}</text>
            </view>
            <u-line></u-line>
          </view>
        </u-index-item>
      </template>
      <view slot="footer" class="u-safe-area-inset--bottom" style="text-align: center; margin-top: 20upx">
        <text class="list__footer">共{{ groupList.length }}个群组</text>
      </view>
    </u-index-list>
    <u-empty v-if="groupList.length==0" marginTop="200upx" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
    </u-empty>
  </view>
</template>

<script>
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
      // 分组列表
      groupList:[]
    }
  },
  computed: {
    itemArr() {
      let _this = this
      const reg = /[^a-zA-Z]/
      return this.indexList.map(item => {
        const arr = []
        // 递归进行分组
        const groupList = _this.groupList
        groupList.forEach(group=>{
          if(group.alphabetic === item){
            arr.push(group)
          }else if(item == '#' && reg.test(group.alphabetic)){
            arr.push(group)
          }
        })
        return arr
      })
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    // 新建分组
    add() {
      this.$Router.push({path: '/pages/group/add'})
    },
    // 获取所有群组
    groupPage(groupVo) {
      // 不分页查询
      let params = {
        current: -1,
        size: -1,
        ...groupVo
      }
      this.$api.groupPage(params).then(res => {
        if (res.success) {
          this.groupList = res.data.records;
        }
      })
    },
    // 点击搜索
    search(val){
      this.groupPage({groupName:val})
    },
    // 跳转群组信息
    toInfo(group){
      this.$Router.push({ path: '/pages/group/info', query: {groupId:group.id}})
    },
    // 点击搜索取消
    change(val){
      if(val){
        this.search(val)
      }else{
        this.groupPage()
      }
    },
    // 初始化
    init() {
      this.groupPage()
    },
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
</style>
