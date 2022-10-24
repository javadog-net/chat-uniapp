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
              <u--image :showLoading="true" :src="item.friendAvatar" width="32px" height="32px"></u--image>
              <view style="display: flex; flex-direction: column;">
                <text class="u-cell-text" size="18" style="margin-left: 20upx;">{{ item.friendNickname }}</text>
                <text class="u-cell-text" size="14" style="margin: 10upx 0 0 20upx; font-size: 12px;color: #909399">
                  申请日期:{{ $moment(item.updateTime).format("YYYY-MM-DD") }}
                </text>
              </view>
            </view>

            <view
                slot="value"
                class="u-slot-value"
            >
              <u--text v-if="item.status == 0" text="待对方同意" color="#cdcdcd"></u--text>
              <u--text v-if="item.status == 1" text="已同意" color="#000"></u--text>
              <u--text v-if="item.status == 2" suffixIcon="question-circle-fill" text="已拒绝"
                       @click="reasonPopup(item)"></u--text>
            </view>
          </u-cell>
        </u-list-item>
      </u-list>
    </view>

    <u-popup :show="show" mode="bottom" @open="open" @close="close">
      <view>
        <u-row customStyle="margin: 20px">
          <u-col span="12" style="flex-direction: inherit;">
            <u-icon color="#fa3534" name="person-delete-fill" size="32" style="margin-right: 20upx;"></u-icon>
            <text> 拒绝理由:{{ reason ? reason : '对方很懒什么都没写,但就是拒绝了你-_-!' }}</text>
          </u-col>
        </u-row>
        <u-button @click="repeatAdd" type="primary">重新添加</u-button>
      </view>
    </u-popup>

    <u-modal
        :asyncClose="true"
        title="添加备注"
        :show="modalShow"
        closeOnClickOverlay
        showCancelButton
        @close="() => modalShow = false"
    >
      <view class="slot-content">
        <u--input
            placeholder="请输入内容"
            border="surround"
            v-model="remark"
        ></u--input>
      </view>
      <u-button
          slot="confirmButton"
          text="重新申请"
          type="success"
          shape="circle"
          @click="confirmButton"
      ></u-button>
    </u-modal>
  </view>
</template>

<script>
import {
  mapActions,
  mapGetters
} from "vuex"

export default {
  data() {
    return {
      show: false,
      modalShow: false,
      invitationList: [],
      reason: '',
      friendId:'',
      remark:''
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
    // 加载邀请信息
    async loadInvitation() {
      let userId = this.userInfo.id
      const param = {
        userId
      }
      const result = await this.$api.invitationList(param)
      if (!result.success) {
        this.$tips.error(result.message)
        return
      }
      this.invitationList = result.data
    },
    // 理由弹出层事件
    reasonPopup(item) {
      this.reason = item.reason
      this.friendId = item.friendId
      this.show = true
    },
    // 打开
    open() {
    },
    // 关闭
    close() {
      this.show = false
    },
    // 重复邀请
    repeatAdd() {
      this.show = false
      this.modalShow = true
    },
    // 确认按钮事件
    async confirmButton() {
      const param = {
        remark: this.remark,
        friendId: this.friendId,
      }
      const result = await this.$api.repeatInvitation(param)
      if (!result.success) {
        this.$tips.error(result.message)
        return
      }
      uni.$u.toast("已重新申请添加")
      this.loadInvitation()
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
