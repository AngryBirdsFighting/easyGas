#使用到的技术栈：
vue@2.5.13
vue-axios@0.17.1(前后台交互类似ajax)
vue-router@2.5.3(路由)
vuex@2.3.1(spa必备) 
element-ui@2.0.11(饿了么UI) 
node-sass@4.5.0
ES6 
webpack@2.6.1 
node@6.10.3
npm @3.10.10

``` **注意：1：vue2.0版本以上的支持IE9及以上3：vue语法中不需要分号作为结束**
```

## 功能
- 系统说明

## 开发
```bash
    # 安装依赖
    cnpm install

    # 本地开发 开启服务
    npm run dev
    #or 直接双击start.bat

    # 关闭node服务
    #打开windows任务管理器，找到node进程，结束进程就把服务关闭了。
```
```

浏览器访问 http://localhost:81

## 发布
```bash
    # 构建生产环境
    npm run build:prod
    #or 直接双击build.bat
```
## 模拟运行正式环境(目前有版本依赖问题)
```bash
    # nginx环境下运行(tomcat类似)
    1.执行命令npm run build:prod后根目录生成一个dist包，配置ngx的config文件路径/dist
    2.启动nginx服务：双击nginx.exe
    3.访问入口：http://localhost:端口号/dist/index.html
    4.关闭nginx服务：直接删进程
```
## 浏览器调试
```
    1.浏览器上安装 Vue Devtools工具，是基于谷歌浏览器的的一款工具。
    具体安装步骤参考：https://www.cnblogs.com/tanyongli/p/7554045.html
```
## 关于图标
```
    本项目使用了两套图标系统，具体使用方法参照以下官方链接:
    1.http://element.eleme.io/#/zh-CN/component/icon
    2.http://fontawesome.io/icons/
    使用方法：
    fontawesome：a.在index.html中引入<link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
                 b.在使用图标的地方放置图标<i class="fa fa-home" aria-hidden="true"></i>
    element：<i class="el-icon-delete"></i>
```
## 关于UI系统
```
    由于bootstrap不支持mvvm已弃用，本项目使用了全新的elementUI系统，具体使用方法参照以下官方链接:
    1.http://element.eleme.io/#/zh-CN/component/installation
```
## 目录结构
```shell
├── build                      // 主要利用webpack与node插件启动一些相关服务的js文件 
│   ├── check-versions.js      //检查npm,nodejs版本
│   ├── dev-client.js          //浏览器端代码，用于实现webpack的热更新,实现浏览器端的EventSource，用于跟服务器双向通信
│   ├── dev-server.js          // 开发环境配置信息  入口文件
│   ├── utils.js               //配置资源路径，配置css加载器
│   ├── vue-loader.conf.js     //配置css加载器等
│   ├── webpack.base.conf.js   //webpack基本配置
│   ├── webpack.dev.conf.js    //用于开发的webpack设置
│   ├── webpack.prod.conf.js   //用于打包的webpack设置
├── config                     // 主要是针对开发环境，生产环境，测试环境的配置信息
├── src                        // 源代码
│   ├── assets                 // 主题 字体 图片等静态资源
│   ├── components             // 全局公用组件。不直接显示
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter过滤器（后台返回的数据需要处理的）
│   ├── global                 // 全局调用后台接口设置（vue-resource）
│   ├── router                 // 路由
│   ├── store                  // 全局store管理 状态管理
│   ├── utils                  // 全局公用方法以及校验
│   ├── view                   // view视图层 vue组件
        ├── bizmgr             // 业务管理组件
        ├── error              // 401、404组件
        ├── index              // 首页组件
        ├── layout             // 菜单、头部组件
        ├── login              // 登录、找回密码、验证密码组件
        ├── sysmgr             // 系统管理组件
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   ├── dataJson               // 模拟接口json
│   └── theme                  // 主题文件
├── .babelrc                   // babel-loader 配置：将浏览器不识别的转换成浏览器识别的
├── eslintrc.js                // eslint 配置项校验语法
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json npm下载依赖包、项目信息以及运行脚本配置

```

## 单页面项目需要路由来进行跳转其中3-5步骤合到一个vue组件中./src/views/layout/Layout.vue参考文章：https://www.cnblogs.com/axl234/p/5899952.html
###1：整体流程是创建组件(./src/main.js入口，判断store.getters.token没有值判断白名单是否包含，有的话直进入白名单的路由，反之进入登录页面；store.getters.token有值store的dispatch触发GetInfo的action从而调用相对应的mutations改变state。除了白名单的路由其他的component都会加载layout,也就是头部和菜单，在Sidebar组件中会将store的getter的permission_routers映射到Sidebar组件计算属性中，将该属性传递给子组件SidebarItem菜单，从而渲染菜单)
###2：创建路由器实例（./src/router/index.js）
###3：创建路由映射(./src/views/layout/Sidebar.vue   mapGetters)
###4：找到路由<router-link> (./src/views/layout/SidebarItem.vue)
###5：使用<router-view>渲染组件(./src/views/layout/AppMain.vue)



##注意事项：
###1：全局方法 Vue.use() 使用插件
###2：组件命名：首字母大写  html引用小写以-分隔  AppMain.vue组件  引用为<app-main/>
###3：html不区分大小写，父向子组件通信时props驼峰式名字，在html中要改为-拼接：myName==>my-name
###4：传递一个真正的 JavaScript 数值，一定必须切记使用 v-bind，从而让它的值被当作 JavaScript 表达式计算：v-bind:some-prop="1"
###5：所有的后台请求 添加/proxy  比如/login 要这么写  /proxy/login 
###6: 父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译。
###7: 父子组件的关系可以总结为 prop 向下传递，事件向上传递。父级向子级的通信是单向数据流。
       子组件通过事件：$on(eventName) 监听事件、$emit(eventName) 触发事件来向父级通信.非父子组件的通信:
       bus.$emit('id-selected', 1)//触发组件 A 中的事件
       bus.$on('id-selected', function (id) {})// 在组件 B 创建的钩子中监听事件
       直接访问子组件：ref 为子组件指定一个引用 ID。$refs    只在组件渲染完成后才填充，并且它是非响应式的。它仅仅是一个直接操作子组件的应急方案——应当避免在模板或计算属性中使用 $refs。
       异步组件：components: {'my-component': () => import('./my-async-component')}
###8：提交代码一定不要提交node_modules中文件夹以及npm-debug.log（服务启动失败日志）



## vue常用的语法：https://cn.vuejs.org/v2/api/
```shell
    1.常用指令：v-text、v-bind(:)、v-model、v-if、v-show、v-on(@)、v-for
    1.1 v-text和{{}}功能一样，比{{}}更好一点是不会在刷新页面的时候加载{{}}
    1.2 v-bind(:)是动态绑定指令，样式属性绑定。默认情况下标签自带属性的值是固定的，在为了能够动态的给这些属性添加值，可以使用v-bind:你要动态变化的值="表达式"，用于绑定属性和数据。
    1.3 v-model用在表单控件上的，用于实现双向数据绑定，所以如果你用在除了表单控件以外的标签是没有任何效果的。修饰符.lazy//当值发生改变才触发 .number//输入值转为数值类型.trim  //自动过滤用户输入的首尾空白字符
    1.4 条件渲染：v-if: 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。v-if也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
    v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。一般来说，v-if 有更高的切换开销，而v-show有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。
    当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。
    1.5:v-on(@)监听事件。事件修饰符
        <!-- 阻止单击事件冒泡 -->
        <a v-on:click.stop="doThis"></a>
        <!-- 提交事件不再重载页面 -->
        <form v-on:submit.prevent="onSubmit"></form>
        <!-- 修饰符可以串联  -->
        <a v-on:click.stop.prevent="doThat"></a>
        <!-- 只有修饰符 -->
        <form v-on:submit.prevent></form>
        <!-- 添加事件侦听器时使用事件捕获模式 -->
        <div v-on:click.capture="doThis">...</div>
        <!-- 只当事件在该元素本身（而不是子元素）触发时触发回调 -->
        <div v-on:click.self="doThat">...</div>
        <!-- click 事件只能点击一次，2.1.4版本新增 -->
        <a v-on:click.once="doThis"></a>
        <!--某个组件的根元素上监听一个原生事件-->
        <my-component v-on:click.native="doTheThing"></my-component>
    1.6：v-for可以是数组也可以是对象 v-for="item in items"、v-for="（index,value） in sites"、
    v-for="（index,value,key） in sites"//对象
    vue有观察数组的变异方法，只要数组变化了，视图就会变化，方法如下：push()、pop()、shift()、unshift()、splice()、sort()、reverse()
    2.计算属性：computed观察和响应Vue 实例上的数据变动，methods 来替代 computed，效果上两个都是一样的，但是 computed 是基于它的依赖缓存，只有相关依赖发生改变时才会重新取值。而使用 methods ，在重新渲染的时候，函数总会重新调用执行。
    2.过滤器filter：用来处理后台返回的数据，比如type为1、2、3过滤器处理后页面展示是A、B、C
    3.组件：组件命名：KebabCase，components: {'kebab-case': { /* ... */ }},HTML 模板中，请使用 <kebab-case></kebab-case>
    组件的作用域是孤立的。父子组件的关系可以总结为 prop 向下传递，事件向上传递。父组件通过 prop 给子组件下发数据，子组件通过事件给父组件发送消息。
    4.生命周期钩子函数:https://cn.vuejs.org/v2/api/#选项-生命周期钩子
    a：beforeCreate在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
    b：created在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
    c:beforeMount在挂载开始之前被调用：相关的 render 函数首次被调用。该钩子在服务器端渲染期间不被调用。
    d:mounted el被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted.该钩子在服务器端渲染期间不被调用。
    e:beforeUpdate数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。该钩子在服务器端渲染期间不被调用。
    f:updated由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。注意 updated 不会承诺所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以用 vm.$nextTick 替换掉 updated.该钩子在服务器端渲染期间不被调用。
    g:activated 当keep-alive 组件激活时调用。该钩子在服务器端渲染期间不被调用。
    h:deactivated keep-alive 组件停用时调用。该钩子在服务器端渲染期间不被调用。
    i:beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。该钩子在服务器端渲染期间不被调用。
    j:destroyed  Vue 实例销毁后调用。调用后Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。
    k:errorCaptured 2.5.0+ 新增
```


## axios调用接口 官网：https://www.npmjs.com/package/axios 中文翻译网址：https://www.kancloud.cn/yunye/axios/234845
```shell
    1.一个基于ES6的Promise的网络请求库，是一个ajax库。请参考阮一峰的ES6的promise：http://es6.ruanyifeng.com/#docs/promise
    2.封装的axios位于：src/global/http.js 注释写的很详细
    3.vue的methods中调用接口：(this.$instance.get、this.$instance.post一般用这两个)
    let vm = this;//由于箭头函数是没有this指向的，因此先保存this
    let params = {};
    params.userName = "qinbb";
    params.passWord = "12356";
    vm.$instance.get('/login', {param:params}).then(res =>{  //第一个参数是url，第二个是参数
        if(res.status == 200){
            let data = res.data.data;
            console.log(data);
            //对数据进行操作
        }else{
            Message.error({message:"调用接口失败"});
        }
    }).catch(error => {});
    vm.$instance.post('/login', params).then(res =>{  //第一个参数是url，第二个是参数
        if(res.status == 200){
            let data = res.data.data;
            console.log(data);
            //对数据进行操作
        }else{
            Message.error({message:"调用接口失败"});
        }
    }).catch(error => {});
    4：若是需要对数据进行异步编程，需要使用es6的Promise对象
    return new Promise((resolve, reject) => {
        console.log('登录入参：',userInfo);
        //调用接口
        instance.get(api.login, {userInfo}).then(res =>{
          if(res.status == 200){
                let data = res.data.data;
                //对数据进行异步编程
                resolve();//异步操作成功
            }else{
                Message({
                    showClose: true,
                    message: "调用接口失败",
                    type: 'error'
                });
            }
        }).catch(error => {});
    });

```


##  vue-resource调用接口（vue已经不再维护，不建议使用） 官网https://www.npmjs.com/package/vue-resource
```shell
    1.支持使用es6中的Promise，Promise用于异步计算。详情：http://es6.ruanyifeng.com/#docs/promise
    2.我将常用的get和post请求封装到/src/global/global.js中，其中baseUrl是调用后台接口的ip及端口号，Vue.http.post需要拼接baseUrl和调用接口的url：global.get( url）。真正配置跨域的是在/config/index.js中的proxyTable设置跨域地址。并在启动文件/build/dev-server.js中遍历proxyTable配置信息，并且使用中间件加载进去。
    3.调用的时候需要引入这个文件import {global} from 'src/global/global';具体使用方法如下：
        //请求开发环境接口
        //后台请求地址  所有的请求前加 /proxy
        let url = '/proxy/update';
        //向后台传递的参数
        let par = {
          "beginDate": "20170616",
          "endDate": "20170616"
        };
        //调用global封装好的get接口
        global.get( url,{params: par },function(res){
            // 响应成功回调
            console.log('-------开发环境获取到数据：',JSON.stringify(res) )
        },function(res){
        // 响应错误回调
        },false)
```




## vue-router路由:https://router.vuejs.org/zh-cn/
```shell
    1.route：单路由 一条
    2.routes：一组路由，将单条路由组合到一起[{},{}]
    3.router：是一个机制，相当于一个管理者，它来管理路由,router到routes找路由。整体流程是，将router机制注入到vue的根实例中，router会管理routers路由组照相对应的路由，寻找它的 to 属性，它的 to 属性和 js 中配置的路径{ path: '/home', component: Home}  path 一一对应，从而找到了匹配的组件， 最后把组件渲染到 <router-view> 标签所在的地方。所有的这些实现才是基于hash 实现的。
    4.路由之间来回切换并不会销毁vue组件，渲染过一次的组件，再次点击还是原来的，不会发生变化，若是需要发生变化，只能在组件内部（user.vue中）利用watch 来监听$route 的变化
    5.component每个路由应该映射一个组件。除了登录以及设置密码、402、404的路由的component是自己本身组件，其他都是layout组件也就是整体框架（左侧菜单和头部）。
```

## vuex状态管理:https://vuex.vuejs.org/zh-cn/getting-started.html 可以参考了解flux思想：http://www.ruanyifeng.com/blog/2016/01/flux.html
```shell
    1.目前只有用户信息、菜单权限、app配置相关状态使用vuex存储在全局，其它数据都由每个业务组件自己管理。
    2.vuex中的数据刷新页面后，会全部消失。存vuex时，同时记得存 Session Storage。或者F5时重新获取接口
    3.JavaScript代码是运行在内存中的，代码运行时的所有变量，函数，也都是保存在内存中的。刷新页面，以前申请的内存被释放，重新加载脚本代码，
变量重新赋值，所以这些数据要想储存就必须储存在外部，例如：Local Storage, Session Storage, IndexDB等。
    4.Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割。getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算
    5.vuex的工作流程：store的dispatch触发action，action通过commit找到相对应的mutations，从而改变state也就是data。更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。Action 通过 store.dispatch 方法触发
```








