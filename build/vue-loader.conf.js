/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:47:20
 * @Description: css-lodader方法提取出来 不需要在webpack.base.conf.js中配置
 */
const utils = require('./utils');
const config = require('../config');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	// 处理.vue文件中的样式
    loaders: utils.cssLoaders({
    	// 是否打开source-map
        sourceMap: isProduction
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
        extract: isProduction // 是否提取样式到单独的文件
    })
}
