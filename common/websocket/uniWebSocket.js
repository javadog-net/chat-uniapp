/**
 * 封装uniapp的WebSocket对象，使其与原生类似，供stomp使用
 */
class UniWebSocket {
	constructor(url, protocols) {
		// 是否主动关闭连接
		this.activeClose = false
		
		// 相关事件数组
		this.openListener = []
		this.closeListener = []
		this.errorListener = []
		this.messageListener = []
		
		// 创建连接
		uni.connectSocket({
			url: url,
			protocols: protocols,
		})
		// 连接开启
		uni.onSocketOpen(res => {
			this.onopen(res)
			for (let i in this.openListener) {
				this.openListener[i](res)
			}
		})
		
		// 连接关闭
		uni.onSocketClose(res => {
			// 主动关闭连接不进行回调
			if (this.activeClose) {
				this.activeClose = false
			} else {
				this.onclose(res)
			}
			for (let i in this.closeListener) {
				this.closeListener[i](res)
			}
		})
		
		// 连接异常
		uni.onSocketError(res => {
			this.onerror(res)
			for (let i in this.errorListener) {
				this.errorListener[i](res)
			}
		})
		
		// 接收消息
		uni.onSocketMessage(res => {
			this.onmessage(res)
			for (let i in this.messageListener) {
				this.messageListener[i](res)
			}
		})
	}

	/**
	 * 添加监听
	 * @param {Object} eventName
	 * @param {Object} callback
	 */
	addEventListener(eventName, callback) {
		if (eventName === 'open') {
			this.openListener.push(callback)
		} else if (eventName === 'close') {
			this.closeListener.push(callback)
		} else if (eventName === 'error') {
			this.errorListener.push(callback)
		} else if (eventName === 'message') {
			this.messageListener.push(callback)
		}
	}

	/**
	 * 移除最后一个监听
	 * @param {Object} eventName
	 */
	removeEventListener(eventName) {
		if (eventName === 'open') {
			this.openListener.pop()
		} else if (eventName === 'close') {
			this.closeListener.pop()
		} else if (eventName === 'error') {
			this.errorListener.pop()
		} else if (eventName === 'message') {
			this.messageListener.pop()
		}
	}

	/**
	 * 连接开启
	 * @param {Object} res
	 */
	onopen(res) {}

	/**
	 * 连接关闭
	 * @param {Object} res
	 */
	onclose(res) {}

	/**
	 * 连接异常
	 * @param {Object} res
	 */
	onerror(res) {}

	/**
	 * 接收消息
	 * @param {Object} res
	 */
	onmessage(res) {}

	/**
	 * 发送消息
	 * @param {Object} data
	 */
	send(data) {
		uni.sendSocketMessage({
			data: data
		})
	}

	/**
	 * 关闭连接
	 */
	close() {
		this.activeClose = true
		uni.closeSocket()
	}
}

export default UniWebSocket
