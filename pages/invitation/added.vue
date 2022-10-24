<template>
  <view>
    <navbar type="second" title="我添加的"></navbar>
    <u-empty v-if="invitationList.length==0" marginTop="200upx" mode="list"
             icon="http://cdn.uviewui.com/uview/empty/list.png">
    </u-empty>
    <view class="container">
      <u-list height="auto">
        <u-list-item
            v-for="(item, index) in invitationList"
            :key="index"
        >
          <u-cell>
            <view
                slot="title"
                class="u-slot-title"
                style="display: flex; align-items: center"
            >
              <u--image :showLoading="true" :src="item.userAvatar" width="32px" height="32px"></u--image>
              <view style="display: flex; flex-direction: column;">
                <text class="u-cell-text" size="18" style="margin-left: 20upx;">{{ item.userNickname }}</text>
                <text class="u-cell-text" size="14" style="margin: 10upx 0 0 20upx; font-size: 12px;color: #909399">
                  申请日期:{{ $moment(item.updateTime).format("YYYY-MM-DD") }}
                </text>
              </view>
            </view>

            <view
                slot="value"
                class="u-slot-value"
            >
              <u-button v-if="item.status == 0" text="待处理" type="success" @click="deal(item)"></u-button>
              <u--text v-if="item.status == 1" text="已同意" color="#000"></u--text>
              <u--text v-if="item.status == 2" suffixIcon="question-circle-fill" text="已拒绝"></u--text>
            </view>
          </u-cell>
        </u-list-item>
      </u-list>
    </view>
    <u-modal
        :asyncClose="true"
        title="同意/拒绝"
        :show="modalShow"
        closeOnClickOverlay
        showCancelButton
        @close="() => modalShow = false"
    >
      <view class="slot-content">
        <u--form
            labelPosition="left"
        >
          <u-form-item label="备注">
            <u--text type="warning" :text="invitation.remark?invitation.remark:'对方啥也没写,就是想加你'"></u--text>
          </u-form-item>
          <u-form-item
              label="理由"
              borderBottom
          >
            <u--input
                v-model="invitation.reason"
            ></u--input>
          </u-form-item>
        </u--form>
      </view>
      <view slot="confirmButton" style="display: flex; justify-content: space-between">
        <u-button
            text="通过"
            type="success"
            shape="circle"
            @click="handel(1)"
            style="margin-right: 50upx"
        ></u-button>
        <u-button
            text="拒绝"
            type="error"
            shape="circle"
            @click="handel(2)"
        ></u-button>
      </view>

    </u-modal>
  </view>
</template>

<script>
import {
  mapGetters
} from "vuex"

export default {
  data() {
    return {
      // 模态框展示
      modalShow: false,
      // 邀请列表
      invitationList: [],
      // 理由
      reason: '',
      // 好友Id
      friendId: '',
      // 备注
      remark: '',
      // 邀请对象
      invitation: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.loadInvitation()
    },
    // 加载邀请数据
    async loadInvitation() {
      let userId = this.userInfo.id
      const param = {
        friendId: userId
      }
      const result = await this.$api.invitationList(param)
      if (!result.success) {
        this.$tips.error(result.message)
        return
      }
      this.invitationList = result.data
    },
    // 处理
    deal(item) {
      this.modalShow = true
      this.invitation = item
    },
    // 执行事件
    async handel(status){
      this.$tips.loading()
      const param = {
        id: this.invitation.id,
        remark: this.invitation.remark,
        reason: this.invitation.reason,
        status: status,
      }
      const result = await this.$api.handleInvitation(param)
      if (!result.success) {
        this.$tips.error(result.message)
        return
      }
      uni.$u.toast("操作成功")
      this.$Router.push('/pages/index/index')
      this.modalShow = false
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
