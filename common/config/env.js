// prod-生产 dev-开发 test-测试
const env = "dev"

const uri = {
	friendMsgUrl : 'pages/msg/friendMsg',
	groupMsgUrl :'pages/msg/groupMsg',
}

const prod = {
	baseUrl: 'https://xxx/chat/v1', // 线上环境'
	socketUrl: 'wss://xxx/chat/v1/socket',
	...uri
}
const dev = {
	baseUrl: 'http://localhost:8001/chat/v1', // 生产环境'
	socketUrl: 'ws://localhost:8001/chat/v1/socket',
	...uri
}
const test = {
	baseUrl: 'http://localhost:8002/chat/v1', // 测试环境'
	socketUrl: 'ws://localhost:8002/chat/v1/socket',
	...uri
}

const config = {
	dev,
	prod,
	test,
}

export default config[env]
