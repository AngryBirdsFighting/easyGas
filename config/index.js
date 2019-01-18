/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:49:38
 * @Description: 设置生产、开发环境的配置信息
 */
 // 引入nodejs的path模块，进行一些路径的操作，详情可以查看node官方的api
var path = require('path');

  
module.exports = {
    // 构建产品时使用的配置
    build: {
        prodEnv: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),// html入口文件 若是没有dist文件夹就会生成dist文件夹
        assetsRoot: path.resolve(__dirname, '../dist'),// 产品文件的存放路径
        assetsSubDirectory: 'static',// 二级目录，存放静态资源文件的目录，位于dist文件夹下
        // 发布路径，如果构建后的产品文件有用于发布CDN或者放到其他域名的服务器，可以在这里进行设置
        // 设置之后构建的产品文件在注入到index.html中的时候就会带上这里的发布路径
        assetsPublicPath: '../', //生产环境assetsPublicPath: '/'
        staticPath:'../',        //生产环境 staticPath:''
        productionSourceMap: false,// 是否使用source-map
        productionGzip: false,// 是否开启gzip压缩
        productionGzipExtensions: ['js', 'css'],// gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压缩
        bundleAnalyzerReport: process.env.npm_config_report// 是否展示webpack构建打包之后的分析报告
    },
      // 开发过程中使用的配置
    dev: {
        env: require('./dev.env'),// 环境变量
        port: 81,// dev-server监听的端口
        autoOpenBrowser: true,// 是否自动打开浏览器
        assetsSubDirectory: 'static',   // 静态资源文件夹
        assetsPublicPath: '/',// 发布路径
        //staticPath:'/static',//api静态资源
        staticPath:'/static/',
        // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
        // 例如将'localhost:2018/login'代理到'http://192.168.1.120:8085/mockjsdata/4/auth/login'
        proxyTable: { 
            '/proxy': {  
                target: 'http://47.104.139.220:8088',
                changeOrigin : true,//允许跨域
                //将对资源的请求重定向到另一路径
                pathRewrite: {
                  '^/proxy': ''
                }
            }
        },
        cssSourceMap: false // 是否开启 cssSourceMap
    }
}
