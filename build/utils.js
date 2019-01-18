/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:47:01
 * @Description: 提供工具函数，包括生成处理各种样式语言的loader，获取资源文件存放路径的工具函数
 */
var path = require('path');
var config = require('../config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 资源文件的存放路径
exports.assetsPath = function (_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, _path);
}
// 生成css、sass、scss等各种用来编写样式的语言所对应的loader配置
exports.cssLoaders = function (options) {
    options = options || {};

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',// 是否最小化
            sourceMap: options.sourceMap// 是否使用source-map
        }
    };

    // 生成各种loader配置，并且配置了extract-text-pulgin
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader];// 默认是css-loader
        // 如果非css，则增加一个处理预编译语言的loader并设好相关配置属性
    // 例如generateLoaders('less')，这里就会push一个less-loader
    // less-loader先将less编译成css，然后再由css-loader去处理css
    // 其他sass、scss等语言也是一样的过程
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        /// 配置extract-text-plugin提取样式
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader',
                publicPath: '../../'
            });
        } else {
            // 无需提取样式则简单使用vue-style-loader配合各种样式loader去处理<style>里面的样式
            return ['vue-style-loader'].concat(loaders);
        }
    }

   // 得到各种不同处理样式的语言所对应的loader
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {indentedSyntax: true}),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    };
}

// Generate loaders for standalone style files (outside of .vue)
// 生成处理单独的.css、.sass、.scss等样式文件的规则
exports.styleLoaders = function (options) {
    var output = [];
    var loaders = exports.cssLoaders(options);
    for (var extension in loaders) {
        var loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }
    return output;
}
