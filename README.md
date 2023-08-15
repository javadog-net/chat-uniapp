<div align="center">
    <h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">JavaDog Chat v1.0.0</h1>
	<h4 align="center">基于SpringBoot+uniapp简单通讯聊天软件</h4>
</div>

### 📚项目介绍
JavaDog Chat 简单通讯聊天软件是基于SpringBoot+MybatisPlus+uniapp+uview+stomp等更多优秀组件及前沿技术开发，注释丰富，代码简洁，开箱即用，兼容H5+小程序+APP,及其适合入门学习！将想说却不敢说，相爱去不敢爱的思绪放置与此。

### 🎁快速链接
微信公众号：**JavaDog程序狗**
**关注公众号，发送 chat ，无任何套路即可获得**

![](https://img.javadog.net/blog/chat/dc17e1bea0864e0bac8c0bfdd43e6684~tplv-k3u1fbpfcp-zoom-in-crop-mark_4536_0_0_0.webp)

或访问
[https://javadog.net/archives/chat](https://javadog.net/archives/chat)

### 🌱体验地址
**因二维码图被和谐，最好访问[https://javadog.net/archives/chat](https://javadog.net/archives/chat)进行扫码访问体验**
#### 1.网页H5
> http://chat.javadog.net

#### 2.APP
> https://www.pgyer.com/javadog-chat


### 🍓体验账号
>账号：18306390693
  密码：123456
如需多个账户可自行注册
### 主要模块功能
![](https://img.javadog.net/blog/chat/21911c0b62a84f90bab93ef546e2420e~tplv-k3u1fbpfcp-zoom-in-crop-mark_4536_0_0_0.webp)

#### 🛳️登录注册
1. 用户可自主注册，并通过用户名密码进行登录
2. 如忘记密码则可通过邮箱找回密码，但需要在配置文件中配置邮箱相关内容
![](https://img.javadog.net/blog/chat/a30d46c2f014429993aaf4c255ac5844~tplv-k3u1fbpfcp-zoom-1.jpg)
#### 🍭消息
1. 展示群组及好友聊天信息，并有消息提醒及未读标记
2. 可通过上方放大镜进行搜索,或者扫一扫进行好友添加
3. 点击查看聊天信息，可进行文字/图片/视频/语音等发送方式
![](https://img.javadog.net/blog/chat/a60f5051e2324a388b3c2e0cb6b49c14~tplv-k3u1fbpfcp-zoom-1.jpg)
![](https://img.javadog.net/blog/chat/5b3c07ee3873400e8b4f4b67c4f863f2_tplv-k3u1fbpfcp-zoom-1.png)


#### 🧑‍🤝‍🧑好友
1. 按照字母索引展示所有好友列表，并可通过放大镜搜索
2. 通过右上角扫描二维码进行好友添加
3. "我添加的"本人通过扫码或者搜索添加好友申请列表数据
4. "添加我的"其他用户通过扫码或者搜索添加我本人申请列表数据
5. 通过点击好友进行好有名片查看

![](https://img.javadog.net/blog/chat/47f7a3fc716f4d3f8adb5a928f8961cb_tplv-k3u1fbpfcp-zoom-1.jpg)
![](https://img.javadog.net/blog/chat/7f7815b84b364eba9f78cb82b62e7801_tplv-k3u1fbpfcp-zoom-1.jpg)
#### ⛄群组
1. 按照字母索引展示所有群组列表，并可通过放大镜搜索
2. 通过右上角扫描二维码进行群组加入
3. "新建群组"可根据所需进行群组的创建
4. 通过点击群组进行好有名片查看

![](https://img.javadog.net/blog/chat/e441464e117949f5ae1ec277959c782b_tplv-k3u1fbpfcp-zoom-1.jpg)
#### 🎃我的
1. 点击头像进行头像修改
2. "我的名片"展示本人所属二维码
3. "修改密码"可进行密码重置
4. "关于"展示本狗的博客是个webview跳转
5. 点击退出并退出当前账号

![](https://img.javadog.net/blog/chat/eb470803c10c4d32aad68c3b5f35de7d_tplv-k3u1fbpfcp-zoom-1.jpg)

### 🛠️快速启动
后端chat-provider推荐IDEA打开，前端chat-uniapp推荐HbuliderX打开。

#### 👍前端支撑
| 插件 | 版本 | 用途 |
| --- | ----- |  ----- |
| uview-ui|  ^2.0.31 |多平台快速开发的UI框架 |
| uni-simple-router | ^2.0.7 |专为uniapp打造的路由器 |
| moment | ^2.29.4 |js工具库 |
| mescroll-uni| ^1.3.7 | 上拉加载下拉刷新插件 |
| @uni-ui/code-ui| ^1.4.8 | 二维码生成工具|

#### 👸启动前端

 1. 在chat-uniapp项目目录下执行 
	```
	npm install
	```
 2. 在HBuilderX工具下运行，选择需要运行到哪个终端
 ![](https://img.javadog.net/blog/chat/82f8910e968f4565a4b605cb6fd92340_tplv-k3u1fbpfcp-zoom-1.png)
 
 3. 如需调整环境，请在/common/config/env.js修改环境变量
![](https://img.javadog.net/blog/chat/c7368d72805a464f953bb96254251c08_tplv-k3u1fbpfcp-zoom-1.png)

#### 👍后端支撑
| 插件 | 版本 | 用途 |
| --- | ----- |  ----- |
| jdk |  1.8 |java环境 |
| lombok | 1.18.16 |代码简化插件 |
| maven | 3.6.3 |包管理工具 |
| druid| 1.1.24 | JDBC组件 |
| hutool| 5.7.20 | Java工具类库|
| mybatis-plus| 3.4.1 | 基于 MyBatis 增强工具|
| pinyin4j| 2.5.1 | 拼音组件库|
| mysql | 8.0 / 5.7 | 数据库 |

#### 👦启动后端
 1. 开发工具内配置好，并将maven配置好，建议使用阿里云镜像
 2. 将chat-provider包下的/doc/SQL/db_chat.sql进行本地执行，并在application配置文件中修改数据库配置
 	![](https://img.javadog.net/blog/chat/ef901b1213e544e09ab1c3dd4cdac97e_tplv-k3u1fbpfcp-zoom-1.png)
 3. 运行启动SpringBoot项目，如见到以下日志即为启动成功。
![](https://img.javadog.net/blog/chat/a32beb5b272b487ebd0e6ef02e14f6b8_tplv-k3u1fbpfcp-zoom-1.png)
### 🌀其他辅助
#### 🏋️‍♀️原型图
**本狗第一次画原型，请大佬勿喷**
> 项目路径下/doc/原型/chat.rp

![](https://img.javadog.net/blog/chat/a6339245e0db407197d14ea8427fac23_tplv-k3u1fbpfcp-zoom-1.png)
#### 🤾DB设计
> 项目路径下/doc/数据库设计/chat.pdm

![](https://img.javadog.net/blog/chat/fae0ae5589ab4062b77b531f4781617f_tplv-k3u1fbpfcp-zoom-1.png)


### 😊版权说明

- JavaDog Chat 采用 Apache License2.0协议

- 代码可用于个人学习等，完全开源免费

- 二次开发如用于毕设等二次售卖，未经审核视为侵权

| JavaDog| 狗屋地址 |
| :----:| :----: | 
| 个人博客 | [https://blog.javadog.net](https://blog.javadog.net) | 
| 公众号 | [https://mp.weixin.qq.com/s/_vgnXoQ8FSobD3OfRAf5gw](https://mp.weixin.qq.com/s/_vgnXoQ8FSobD3OfRAf5gw) | 
| CSDN  | [https://blog.csdn.net/baidu_25986059](https://blog.csdn.net/baidu_25986059) | 
| 掘金 | [https://juejin.cn/user/2172290706716775](https://juejin.cn/user/2172290706716775)| 
| 知乎 | [https://www.zhihu.com/people/JavaDog](https://www.zhihu.com/people/JavaDog) | 
| 简书| [https://www.jianshu.com/u/1ff9c6bdb916](https://www.jianshu.com/u/1ff9c6bdb916) | 
| gitee|[https://gitee.com/javadog-net](https://gitee.com/javadog-net)  | 
| GitHub|[https://github.com/javadog-net](https://github.com/javadog-net)| 

