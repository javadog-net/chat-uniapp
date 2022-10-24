<template>
	<view>
		<navbar title="通讯录" back="false" @search="search" @change="change"></navbar>
    <view class="container">
		    <u-index-list :indexList="indexList">
			<view slot="header" class="list">
				<view class="list__item" @click="handle(0)">
					<u-avatar shape="square" size="35" icon="man-add-fill" fontSize="26" randomBgColor></u-avatar>
					<text class="list__item__user-name">我添加的</text>
				</view>
				<u-line></u-line>
				<view class="list__item" @click="handle(1)">
					<u-avatar shape="square" size="35" icon="tags-fill" fontSize="26" randomBgColor></u-avatar>
					<text class="list__item__user-name">想加我的 </text>
          <u-badge style="margin-left: 5px" type="error" :value="invitationNum"></u-badge>
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
					<view class="list" v-for="(friend, index1) in item" :key="index1" @click="toInfo(friend)">
						<view class="list__item">
							<image class="list__item__avatar" :src="friend.avatar"></image>
							<text class="list__item__user-name">{{friend.nickname}}</text>
						</view>
						<u-line></u-line>
					</view>
				</u-index-item>
			</template>
			<view slot="footer" class="u-safe-area-inset--bottom" style="text-align: center; margin-top: 20upx">
				<text class="list__footer">共{{ friendList.length }}位好友</text>
			</view>
		</u-index-list>
      <u-empty v-if="friendList.length==0" marginTop="200upx" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
      </u-empty>
    </view>
	</view>
</template>

<script>
import {
  mapGetters
} from "vuex"
  // 归档索引
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
        friendList:[]
			}
		},
		computed: {
      ...mapGetters(['userInfo','invitationNum']),
      // 好友归组
			itemArr() {
        let _this = this
        const reg = /[^a-zA-Z]/
				return this.indexList.map(item => {
					const arr = []
          // 递归进行分组
          const friendList = _this.friendList
          friendList.forEach(friend=>{
            if(friend.alphabetic === item){
              arr.push(friend)
            }else if(item == '#' && reg.test(friend.alphabetic)){
              arr.push(friend)
            }
          })
					return arr
				})
			}
		},
    onLoad() {

    },
    onShow() {
      this.init()
    },
    methods:{
      // 初始化
      init(){
        this.friendPage()
      },
      // 获取所有好友
      friendPage(friendVo){
        // 不分页查询
        let params = {
          current:-1,
          size:-1,
          ...friendVo
        }
        this.$api.friendPage(params).then(res=>{
          if(res.success){
            this.friendList = res.data.records
          }
        })
      },
      // 点击搜索
      search(val){
        this.friendPage({nickname:val})
      },
      // 点击搜索取消
      change(val){
        if(val){
          this.search(val)
        }else{
          this.friendPage()
        }
      },
      // 跳转好友信息
      toInfo(friend){
        this.$Router.push({ path: '/pages/friend/info', query: {friendId:friend.friendId, nickname:friend.nickname}})
      },
      // 不同处理页面
      handle(index){
        switch (index){
          case 0:
            this.$Router.push({ path: '/pages/invitation/add'})
            break
          case 1:
            this.$Router.push({ path: '/pages/invitation/added'})
            break
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
</style>
