const http = uni.$u.http
const api = {

    /**
     * 登录
     */
    login(params) {
        return http.post('/login', params, {custom: {auth: false}})
    },

    /**
     * 找回密码
     */
    retrieve(params) {
        return http.post('/login/retrieve', params, {custom: {auth: false}})
    },

    /**
     * 登录
     */
    logout() {
        return http.get('/logout')
    },
    /**
     * 注册
     */
    register(params) {
        return http.post('/register', params, {custom: {auth: false}})
    },

    /**
     * 上传
     */
    upload(filePath) {
        const params = {
            name: 'file',
            filePath: filePath,
            fileType: 'image'
        }
        return http.upload('/upload', params)
    },

    /**
     * 好友列表
     */
    friendPage(params) {
        return http.get('/friend', {params})
    },

    /**
     * 发送好友消息
     */
    sendFriendMsg(params) {
        return http.post('/friendMsg', params)
    },

    /**
     * 发送群消息
     */
    sendGroupMsg(params) {
        return http.post('/groupMsg', params)
    },

    /**
     * 好友消息列表
     */
    friendMsgPage(params) {
        return http.get('/friendMsg', {params})
    },

    /**
     * 群组消息列表
     */
    groupMsgPage(params) {
        return http.get('/groupMsg', {params})
    },

    /**
     * 好友详情
     */
    friendDetail(friendId) {
        return http.get(`/friend/${friendId}`)
    },

    /**
     * 好友更新
     */
    friendUpdate(params) {
        return http.put('/friend', params)
    },

    /**
     * 好友删除
     */
    friendDelete(id) {
        return http.delete(`/friend/${id}`)
    },

    /**
     * 用户详情
     */
    userDetail(userId) {
        return http.get(`/user/${userId}`)
    },

    /**
     * 用户列表
     */
    userList(params) {
        return http.get(`/user`, {params})
    },

    /**
     * 用户更新
     */
    userUpdate(params) {
        return http.put('/user', params)
    },

    /**
     * 用户更新密码
     */
    userPwd(params) {
        return http.put('/user/pwd', params)
    },

    /**
     * 好友/群组 首页消息列表
     */
    messageList(params) {
        return http.post('/message', params)
    },

    /**
     * 好友邀请
     */
    invitation(params) {
        return http.post('/invitation', params)
    },

    /**
     * 邀请列表
     */
    invitationList(params) {
        return http.get('/invitation', {params})
    },

    /**
     * 再次邀请
     */
    repeatInvitation(params) {
        return http.put('/invitation', params)
    },

    /**
     * 邀请-通过/拒绝
     */
    handleInvitation(params) {
        return http.put('/invitation/handle', params)
    },

    /**
     * 分组新增
     */
    groupAdd(params) {
        return http.post('/group', params)
    },

    /**
     * 分组列表
     */
    groupPage(params) {
        return http.get('/group', {params})
    },

    /**
     * 群组详情
     */
    groupDetail(groupId) {
        return http.get(`/group/${groupId}`)
    },

    /**
     * 拉人入群
     */
    groupUserAdd(params) {
        return http.post(`/group/pull`, params)
    },

    /**
     * 加入群组
     */
    groupJoin(params) {
        return http.post(`/group/join`, params)
    },

    /**
     * 群组消息撤销
     */
    groupMsgHandle(params) {
        return http.put('/group/msgHandle', params)
    },

    /**
     * 群组消息撤销
     */
    friendMsgHandle(params) {
        return http.put('/friendMsg/msgHandle', params)
    },
}

export default api;
