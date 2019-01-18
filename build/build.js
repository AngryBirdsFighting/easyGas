/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:43:32
 * @Description: 打包生产环境的配置模块 构建环境下的配置
 */
require('./check-versions')();//检查版本信息 主要检查node和npm版本
var server = require('pushstate-server');
var opn = require('opn');
//控制台loading动画
var ora = require('ora');
// rm，用于删除文件或文件夹的插件
var rm = require('rimraf');
var path = require('path');
// 高亮控制台输出的插件
var chalk = require('chalk');
var webpack = require('webpack');
var config = require('../config');
var webpackConfig = require('./webpack.prod.conf');


//在控制台输出building for production...
var spinner = ora('building for ' + process.env.NODE_ENV + '...');
//开始loading动画
spinner.start();


// 首先将整个dist文件夹以及里面的内容删除，以免遗留旧的没用的文件
// 删除完成后才开始webpack构建打包
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err){
        throw err;
    } 
        //webpack编译  
    webpack(webpackConfig, function (err, stats) {
        //停止loading动画
        spinner.stop();
         //如果错误抛出错误
        if (err) {throw err}
            //完成输出相关信息 
        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n');

        console.log(chalk.cyan('  Build complete.\n'));
        if(process.env.npm_config_preview){
            server.start({
                port: 9528,
                directory: './dist',
                file: '/index.html'
            });
            console.log('> Listening at ' +  'http://localhost:9528' + '\n');
        }
    });
});
