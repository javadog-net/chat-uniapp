import { Stomp } from './stomp.js'
import UniWebSocket from './uniWebSocket.js'
import env from '@/common/config/env.js'
import Tips from '@/common/util/tips.js'

/**
 * WebSocket stomp 实例
 */
class Ws {

	errorTimes = 0;

	constructor() {
		// 重连间隔
		this.reconnectInterval = 10000
		// 是否打印debug信息
		this.debug = true
		// ws地址
		const wsUrl = env.socketUrl
		if (wsUrl.indexOf('http://') === 0) {
			this.url = wsUrl.replace('http://', 'ws://')
		} else if (wsUrl.indexOf('https://') === 0) {
			this.url = wsUrl.replace('https://', 'wss://')
		} else {
			this.url = wsUrl
		}
		// stomp实例
		this.client = null
		// 重连事件编号
		this.reconnectId = null
		// 订阅集合
		this.subscribes = {}
	}

	/**
	 * 创建连接
	 */
	connect(token,username) {
		// 如已存在连接则不创建
		if (this.client && this.client.connected) {
			return
		}
		// 创建连接，认证token以第二个参数：Sec-WebSocket-Protocol传递到后台，后台需将此头信息原样返回
		// 注：如不想在此处进行认证，可考虑在下面的client.connect方法中传递header进行认证
		// 从缓存中获取token
		let ws = new UniWebSocket(this.url, [token+"|"+username])
		this.client = Stomp.over(ws)
		// 控制是否打印debug信息
		if (!this.debug) {
			this.client.debug = () => {}
		}
		this.client.connect({},
			frame => {
				// 初始化订阅
				Object.keys(this.subscribes).forEach(key => {
					this.subscribe(key, this.subscribes[key].callback)
				})
			},
			error => {
				// 重连
				this.reconnectId = setTimeout(() => {
					this.reconnect(token,username)
				}, this.reconnectInterval)
			}
		)
		// 监听WebSocket对象连接状态，如失败，则stomp的connect回调不会触发，应在此重连
		ws.onerror = (res) => {
			// 重连
			this.reconnectId = setTimeout(() => {
				// // 刷新token
				// refreshToken().then(() => {
				// 	this.reconnect()
				// })
				if(this.errorTimes>3){
					Tips.error("连接异常，请重新登录!")
					this.errorTimes = 0
					return
				}
				this.reconnect()
				this.errorTimes++;
			}, this.reconnectInterval)
		}
	}

	/**
	 * 重新连接
	 */
	reconnect(token,username) {
		// 订阅状态置false
		Object.keys(this.subscribes).forEach(key => {
			this.subscribes[key]['subscribed'] = false
		})
		// 连接
		this.connect(token,username)
	}

	/**
	 * 断开连接
	 */
	disconnect() {
		// 断开连接
		if (this.client) {
			this.client.disconnect()
		}
		// 停止重连事件
		if (this.reconnectId) {
			clearTimeout(this.reconnectId)
			this.reconnectId = null
		}
		// 清空所有除订阅缓存
		this.subscribes = {}
	}

	/**
	 * 订阅
	 * @param {Object} destination 主题
	 * @param {Object} callback 回调
	 */
	subscribe(destination, callback) {
		if (this.subscribes[destination] && this.subscribes[destination]['subscribed']) { // 已订阅
			return
		} else if (this.client && this.client.connected) { // 已连接：调用订阅，缓存订阅信息
			let subscribe = this.client.subscribe(destination, res => callback(res))
			this.subscribes[destination] = { callback: callback, subscribed: true, subscribe: subscribe }
		} else { // 未连接：缓存订阅信息
			this.subscribes[destination] = { callback: callback, subscribed: false }
		}
	}

	/**
	 * 取消订阅
	 * @param {Object} destination 主题
	 */
	unsubscribe(destination) {
		if (this.subscribes[destination]) {
			// 取消订阅
			this.subscribes[destination].subscribe.unsubscribe()
			// 删除订阅缓存
			delete this.subscribes[destination]
		}
	}

	/**
	 * 向服务器发送消息
	 * @param {Object} destination 主题
	 * @param {Object} message 消息内容
	 */
	send(destination, message) {
		if (this.client) {
			this.client.send(destination, null, message)
		}
	}
}

export default new Ws()
