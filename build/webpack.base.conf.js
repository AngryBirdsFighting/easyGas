/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:48:15
 * @Description: webpack基础配置信息
 */
const path = require('path');
const utils = require('./utils');//工具类 一些方法
const config = require('../config');//默认引入config的index.js
const vueLoaderConfig = require('./vue-loader.conf');//cssloader的设置

//绝对路径
function resolve(dir) {
    return path.join(__dirname, '..', dir);
}
const src = path.resolve(__dirname, '../src');// 工程目录，src源码目录  

module.exports = {
    //入口函数
    entry: {
        //app: './src/main.js',//入口文件
        app: ["babel-polyfill", "./src/main.js"]
    },
    //百度地图
    externals: {
      "BMap": "BMap"
    },
    //输出函数
    output: {
        path: config.build.assetsRoot,//webpack输出（生产环境build）的目标文件夹路径
        filename: '[name].js',//webpack打包生成的js文件命名
        publicPath: process.env.NODE_ENV !== 'development' ?  config.build.assetsPublicPath: config.dev.assetsPublicPath//webpack编译输出的发布路径
    },
    // 配置模块如何被解析，就是import或者require的一些配置
    resolve: {
        extensions: ['.js', '.vue', '.json'],//当使用require或者import的时候，引入这些格式的文件不需要使用扩展名 
        // 别名,在我们require的时候，可以使用这些别名，来缩短我们需要的路径的长度
        // import Vue from 'vue/dist/vue.esm.js'可以写成 import Vue from 'vue'
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'src': path.resolve(__dirname, '../src'),
            'global': path.resolve(__dirname, '../src/global'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components'),
            'views': path.resolve(__dirname, '../src/views'),
            'styles': path.resolve(__dirname, '../src/styles'),
            'api': path.resolve(__dirname, '../src/api'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'store': path.resolve(__dirname, '../src/store'),
            'router': path.resolve(__dirname, '../src/router'),
            'mock': path.resolve(__dirname, '../src/mock'),
            'vendor': path.resolve(__dirname, '../src/vendor'),
            'static': path.resolve(__dirname, '../static')
        }
    },
    //模块化加载juery  const $ = require("jquery")
    externals: {
        // jquery: 'jQuery'
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
    },
    // 对相应文件的编译使用什么工具的配置 
    module: {
        rules: [// 对所有.vue文件使用vue-loader进行编译
            { test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {// 对src和test文件夹下的.js文件使用babel-loader将es6+的代码转成es5
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                include: [resolve('src'), resolve('test')]
            },
            {// 对图片资源文件使用url-loader
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1000,// 小于10K的图片转成base64编码的dataURL字符串写到代码中
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')// 其他的图片转移到静态资源文件夹
                }
            },
            {// 对字体资源文件使用url-loader
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    //注入全局mixin
    // sassResources: path.join(__dirname, '../src/styles/mixin.scss'),
    // sassLoader: {
    //     data:  path.join(__dirname, '../src/styles/index.scss')
    // },
}
