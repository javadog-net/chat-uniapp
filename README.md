<div align="center">
    <p align="center">
        <img src="https://img.javadog.net/blog/3684003dd669bf079a23104972461041.jpg" height="150" alt="logo"/>
    </p>
    <h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">JavaDog Chat v1.0.0</h1>
	<h4 align="center">基于SpringBoot+uniapp简单通讯聊天软件</h4>
</div>

### 📚项目介绍
JavaDog Chat 简单通讯聊天软件是基于SpringBoot+MybatisPlus+uniapp+uview+stomp等更多优秀组件及前沿技术开发，注释丰富，代码简洁，开箱即用，兼容H5+小程序+APP,及其适合入门学习！将想说却不敢说，相爱去不敢爱的思绪放置与此。
<p align="center">     
    <p align="center">
       <a href='https://gitee.com/javadog-net/chat-uniapp'>
       <img src='https://gitee.com/javadog-net/chat-uniapp/badge/star.svg?theme=dark' alt='star'></img>
       </a>
        <a href="https://www.uviewui.com/">
            <img src="https://img.shields.io/badge/uView-2.x-blue.svg" alt="uView">
        </a> 
        <a href="https://shiro.apache.org/">
            <img src="https://img.shields.io/badge/shiro-1.3.2-pink.svg" alt="shiro">
        </a> 
        <a href="http://spring.io/projects/spring-boot">
            <img src="https://img.shields.io/badge/spring--boot-2.4.0-green.svg" alt="spring-boot">
        </a>
        <a href="http://mp.baomidou.com">
            <img src="https://img.shields.io/badge/mybatis--plus-3.4.1-blue.svg" alt="mybatis-plus">
        </a>  
         <a href="http://hutool.cn/">
            <img src="https://img.shields.io/badge/hutool-5.7.20-dark.svg" alt="mybatis-plus">
        </a> 
        <a href="./LICENSE">
            <img src="https://img.shields.io/badge/license-Apache%202-red" alt="license Apache 2.0">
        </a>
    </p>
</p>

### 🎁快速链接
**关注公众号，发送chat，无任何套路即可获得**


### 🌱体验地址
#### 1.网页H5
> http://chat.javadog.net
![h5](https://img.javadog.net//blog/h5.png)

#### 2.APP
![app](https://img.javadog.net//blog/app.png)

#### 3.微信小程序
![c](https://img.javadog.net//blog/c.png)


### 🍓体验账号
>账号：18306390693
密码：123456
如需多个账户可自行注册
### 主要模块功能
![请添加图片描述](https://img-blog.csdnimg.cn/f9b525fdc15649b3855ba0de103bf5d1.png)

#### 🛳️登录注册
1. 用户可自主注册，并通过用户名密码进行登录
2. 如忘记密码则可通过邮箱找回密码，但需要在配置文件中配置邮箱相关内容
   ![请添加图片描述](https://img-blog.csdnimg.cn/b58d38fe569f4d00a9a18294ef0b220d.jpeg)
#### 🍭消息
1. 展示群组及好友聊天信息，并有消息提醒及未读标记
2. 可通过上方放大镜进行搜索,或者扫一扫进行好友添加
3. 点击查看聊天信息，可进行文字/图片/视频/语音等发送方式
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/1878a814ad3c4a88baee8aa04a91acbf.jpeg)
   ![请添加图片描述](https://img-blog.csdnimg.cn/d86f8398203a49b187b28e792c702ce4.png)


#### 好友
1. 按照字母索引展示所有好友列表，并可通过放大镜搜索
2. 通过右上角扫描二维码进行好友添加
3. "我添加的"本人通过扫码或者搜索添加好友申请列表数据
4. "添加我的"其他用户通过扫码或者搜索添加我本人申请列表数据
5. 通过点击好友进行好有名片查看

![在这里插入图片描述](https://img-blog.csdnimg.cn/3cbb51808e5c4bc58139e073894dfd9f.jpeg)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d3456eb0806440e58934af2af6b6613e.jpeg)
#### ⛄群组
1. 按照字母索引展示所有群组列表，并可通过放大镜搜索
2. 通过右上角扫描二维码进行群组加入
3. "新建群组"可根据所需进行群组的创建
4. 通过点击群组进行好有名片查看

![在这里插入图片描述](https://img-blog.csdnimg.cn/2dbef736836f4673be0a3cd6f336afdd.jpeg)
![e](https://img.javadog.net//blog/e.jpg)

#### 🎃我的
1. 点击头像进行头像修改
2. "我的名片"展示本人所属二维码
3. "修改密码"可进行密码重置
4. "关于"展示本狗的博客是个webview跳转
5. 点击退出并退出当前账号
   ![f](https://img.javadog.net//blog/f.jpg)

![请添加图片描述](https://img-blog.csdnimg.cn/7a9987314f5847a794e100870bb06593.jpeg)

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
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/889072787f3347d59b3dcf8a5252833f.png)3. 如需调整环境，请在/common/config/env.js修改环境变量
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/4b622a1654d44307926f837e4552beba.png)

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
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/3dd54fdf2cc4408fbc6fd7ddf03b116e.png)
3. 运行启动SpringBoot项目，如见到以下日志即为启动成功。
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/9a19208cf74b4a4280700f124ff35b39.png)
### 🌀其他辅助
#### 原型图
**本狗第一次画原型，请大佬勿喷**
> 项目路径下/doc/原型/chat.rp

![在这里插入图片描述](https://img-blog.csdnimg.cn/1248b0d43eec49b5b2ddee26c8a1e277.png)
#### DB设计
> 项目路径下/doc/数据库设计/chat.pdm

![请添加图片描述](https://img-blog.csdnimg.cn/a7b5bd51fe2443b2a6189b533c9202e0.jpeg)


### 版权说明

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

