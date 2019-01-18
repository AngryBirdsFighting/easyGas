/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:45:26
 * @Description: 开发环境配置文件：热加载、自动打开浏览器、反向代理加载
 */
// 引入配置文件信息模块 默认引入index.js
let config = require('../config');
if (!process.env.NODE_ENV) {
    // 假如process.env.NODE_ENV全局变量没有值时，设置为'development'开发环境
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV); 
}
// 可以指定打开指定的url使用指定的浏览器或者应用，详情可以去看一下github https://github.com/sindresorhus/opn  
const opn = require('opn');
// 引入nodejs的path模块，进行一些路径的操作，详情可以查看node官方的api
const path = require('path');  
// 引入nodejs的一个框架express,可以帮助我们快速搭建一个node服务 github https://github.com/expressjs/express 
const express = require('express');
// 引入node为webpack提供的一个模块服务 github https://github.com/webpack/webpack 
const webpack = require('webpack');
// 可以指定打开指定的url使用指定的浏览器或者应用，详情可以去看一下github https://github.com/sindresorhus/opn  
const proxyMiddleware = require('http-proxy-middleware');
//引入webpack的开发环境的配置文件webpack.dev.conf.js
const webpackConfig = require('./webpack.dev.conf');

// 端口设置
const port = process.env.PORT || config.dev.port;
// 获取autoOpenBrowser值     !!强制转换为Boolean
const autoOpenBrowser = !!config.dev.autoOpenBrowser;
// 获取需要代理的服务api  
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;



const app = express();// 启动一个express服务 
const compiler = webpack(webpackConfig);// 加载webpack配置  
// webpack的开发中间件，专门为webpack提供的一个简单的中间件，可以让文件都加载内存中，不去读写硬盘，并且当文件被改动的时候，不会刷新页面就会部署成功
let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});
// 一个为webpack提供的热部署中间件。https://github.com/glenjamin/webpack-hot-middleware  
let hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {
    }
});

// 当html被改变的时候，让html被强制部署，使用这个中间件html-webpack-plugin,https://github.com/ampedandwired/html-webpack-plugin  
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({action: 'reload'});
        cb();
    });
});



// proxy api requests遍历代理的配置信息,并且使用中间件加载进去  
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = {target: options};
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

// 重定向不存在的URL，用于支持SPA（单页应用）
// 当访问找不到的页面的时候，该中间件指定了一个默认的页面返回https://github.com/bripkens/connect-history-api-fallback 
app.use(require('connect-history-api-fallback')());

// 使用中间件 
app.use(devMiddleware);

// 热部署  
app.use(hotMiddleware);

// 根据配置信息拼接一个目录路径，然后将该路径下的文件交给express的静态目录管理  
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

//项目访问的地址以及端口号
let uri = 'http://localhost:' + port;

//起服务成功后  打印日志：浏览器的访问项目的地址 
devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n');
});
//导出
module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return
    }

    // 自动打开浏览器并访问项目
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
});
