/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:48:48
 * @Description: 生产环境下wepack配置
 */
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
// copy-webpack-plugin，用于将static中的静态文件复制到产品文件夹dist
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 抽取css，js文件,与webpack输出的bundle分离
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// optimize-css-assets-webpack-plugin，用于优化和最小化css资源
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

// node的process模块中的process.env 指向当前shell的环境变量
let env = process.env.NODE_ENV === 'production' ? config.build.prodEnv : config.build.sitEnv;

function resolveApp(relativePath) {
    return path.resolve(relativePath);
}

let webpackConfig = merge(baseWebpackConfig, {
    module: {
        // 样式文件的处理规则，对css/sass/scss等不同内容使用相应的styleLoaders
    // 由utils配置出各种类型的预处理语言所需要使用的loader，例如sass需要使用sass-loader
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    // 是否使用source-map 浏览器sources加载 该项目的项目文件
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,//配置输出路径
        filename: utils.assetsPath('js/[name].[chunkhash].js'),//输出的文件命名格式
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')//未指定文件名的文件的文件名格式
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        //压缩js插件
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        // 将css提取到单独的文件
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        // 优化、最小化css代码，如果只简单使用extract-text-plugin可能会造成css重复
        // 具体原因可以看npm上面optimize-css-assets-webpack-plugin的介绍
        new OptimizeCSSPlugin(),
        //用于生成dist/index.html，加入hash用于缓存。hash不改变不进行更新
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'testing'
                ? 'index.html'
                : config.build.index,
            template: 'index.html',
            inject: true,
            favicon: resolveApp('favicon.ico'),//配置浏览器title图标
            minify: {
                removeComments: true,// 删除index.html中的注释
                collapseWhitespace: true,// 删除index.html中的空格
                removeRedundantAttributes: true,// 删除各种html标签属性值的双引号
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            path:config.build.staticPath,//路径  ./
            // 注入依赖的时候按照依赖先后顺序进行注入，比如，需要先注入vendor.js，再注入app.js
            chunksSortMode: 'dependency'
        }),
        //将所有从node_modules中引入的js提取到vendor.js，即抽取库文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // 从vendor中提取出manifest
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
         // 将static文件夹里面的静态资源复制到dist
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                //flatten: true,//只拷贝文件不管文件夹
                ignore: ['.*']
            }
        ]),
        //全局挂载插件
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jQuery': 'jquery'
        })
    ]
})

// 如果启动了report，则通过插件给出webpack构建打包后的产品文件分析报告
if (config.build.bundleAnalyzerReport) {
    let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}
module.exports = webpackConfig;
