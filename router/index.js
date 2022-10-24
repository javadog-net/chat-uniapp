import {RouterMount,createRouter} from 'uni-simple-router';
import {ACCESS_TOKEN, USER_INFO} from '@/common/util/constants.js'
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routes: [...ROUTES]
});
const whiteList = ['/pages/login/index','/pages/register/index']
import ws from '@/common/websocket/ws.js'

//全局路由前置守卫
router.beforeEach((to, from, next) => {
		const token = uni.getStorageSync(ACCESS_TOKEN);
		const userInfo = uni.getStorageSync(USER_INFO)
		if(token && userInfo){
			const info = JSON.parse(userInfo)
			const username = info.username;
			// #ifdef H5
			if(Object.keys(ws.subscribes).length>0){
				console.log("ws.subscribes订阅清单=",  ws.subscribes,)
				ws.connect(token,username);
			}else{
				if(to.path != '/pages/index/index'){
					router.push({path: '/pages/index/index'});
				}
			}
			// #endif
			// #ifndef H5
			ws.connect(token,username);
			// #endif
		    next()
		}else{
			if (whiteList.indexOf(to.path) !== -1) {
			  next()
			}else{
			  next({ path: '/pages/login/index'})
			}
		} 
});
// 全局路由后置守卫
router.afterEach((to, from) => {
    console.log('跳转结束')
	console.log('to',to)
	console.log('from',from)
	uni.hideLoading()
})

export {
	router,
	RouterMount
}