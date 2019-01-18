/**
 * @Author:      qinbb
 * @DateTime:    2018-02-01 11:02:54
 * @Description: 生产环境
 */
module.exports = file => () => import('../views/' + file + '.vue')
