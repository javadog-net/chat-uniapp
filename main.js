import App from './App'
import Vue from 'vue'
import uView from 'uview-ui'
import moment from 'moment';
import api from "@/common/api"
import config from '@/common/config/env.js'
import store from '@/store/index.js'
import tips from '@/common/util/tips.js'
import ws from '@/common/websocket/ws.js'

import {
	router,
	RouterMount
} from '@/router'

// 注册全局组件
import navbar from '@/components/navbar/navbar.vue'
import msg from '@/components/msg/msg.vue'
import inputBox from '@/components/inputBox/inputBox.vue'
Vue.component("navbar",navbar)
Vue.component("msg",msg)
Vue.component("inputBox",inputBox)
Vue.config.productionTip = false
Vue.use(router)
Vue.use(uView)
App.mpType = 'app'

moment.locale('zh-cn');

Vue.prototype.$moment = moment;
Vue.prototype.$api = api;
Vue.prototype.$config = config;
Vue.prototype.$tips = tips;
Vue.prototype.$store = store;
Vue.prototype.$ws = ws;
Vue.prototype.$EventBus = new Vue();

const app = new Vue({
	store,
	...App
})

// uview-request
require('@/common/http/request.js')(app)

// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
