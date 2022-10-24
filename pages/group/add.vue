<template>
  <view class="add">
    <navbar :isBack="true" type="second" title="新建群组"></navbar>
    <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
    <view class="container">
      <u--form
          labelPosition="left"
          :model="model"
          :rules="rules"
          ref="form"
      >
        <u-form-item
            label="群名称"
            prop="group.name"
            borderBottom
            ref="item"
            labelWidth="80"
        >
          <u--input
              v-model="model.group.name"
              placeholder="请输入群名称"
              border="none"
          ></u--input>
        </u-form-item>
        <u-form-item
            label="群公告"
            prop="group.notice"
            borderBottom
            ref="item"
            labelWidth="80"
        >
          <u--input
              v-model="model.group.notice"
              border="none"
              placeholder="请输入群公告"
          ></u--input>
        </u-form-item>
        <u-form-item
            label="群介绍"
            prop="group.intro"
            borderBottom
            ref="item"
            labelWidth="80"
        >
          <u--input
              v-model="model.group.intro"
              border="none"
              placeholder="请输入群介绍"
          ></u--input>
        </u-form-item>
        <u-form-item
            label="群头像"
            prop="group.avatar"
            borderBottom
            ref="item"
            labelWidth="80"
        >
          <u-upload
              :fileList="avatarList"
              @afterRead="afterRead"
              name="file"
              multiple
              :maxCount="1"
              width="150"
              height="150"
              @delete="deleteAvatar"
          >
          </u-upload>
        </u-form-item>

      </u--form>

      <u-button
          type="primary"
          text="提交"
          customStyle="margin-top: 50px"
          @click="submit"
      ></u-button>
    </view>

  </view>
</template>

<script>

export default {
  data() {
    return {
      model: {
        // 群组对象
        group: {
          // 群组名
          name: '',
          // 群组公告
          notice: '',
          // 群组简介
          intro: '',
          // 群组头像
          avatar: ''
        },
      },
      // 群头像List
      avatarList:[] ,
      rules: {
        'group.name': {
          type: 'string',
          required: true,
          message: '请填写群名称',
          trigger: ['blur', 'change']
        },
        'group.notice': {
          type: 'string',
          required: true,
          message: '请填写群公告',
          trigger: ['blur', 'change']
        },
        'group.intro': {
          type: 'string',
          required: true,
          message: '请填写群介绍',
          trigger: ['blur', 'change']
        },
        'group.avatar': {
          type: 'string',
          required: true,
          message: '请选择群头像',
          trigger: ['blur', 'change']
        }
      },
    };
  },
  methods: {
    // 读取后的处理函数
    async afterRead(file, lists, name) {
      const result = await this.$api.upload(file.file[0].url)
      if (result.success) {
        const data = result.data
        const avatar = this.$config.baseUrl + data.url
        this.avatarList.push({url: avatar})
        this.model.group.avatar = avatar
      }
    },
    // 提交
    submit() {
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
      this.$refs.form.validate().then(async res => {
        // 调取接口进行数据更新
        const result = await this.$api.groupAdd(this.model.group)
        if (result.success) {
          this.$tips.success("操作成功")
          this.$Router.push({path: '/pages/group/group'})
        }
      })
    },
    // 删除头像
    deleteAvatar(event){
      this.avatarList.splice(event.index, 1)
    },
  }
};
</script>

<style lang="scss">
.container {
  padding: 40upx;
  background: #fff;
}
</style>
