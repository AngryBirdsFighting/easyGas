/**
 * @Author:      qinbb
 * @DateTime:    2018-01-29 16:41:03
 * @Description: api接口配置  本地json数据模拟/static/dataJson  开发、生产环境不需要可以删除
 */

//把全体接口封装在的前端配置文件（序号与接口文档一一对应），多个环境配置时可快速切换整站式的全部接口，不用逐个页面去改。
const config = require('../../config');

let url = {
    // 条件 ? 结果1 : 结果2 //三元运算符，表示条件为true时，等式的结果就为结果1（'./'），否则为结果2('/static/')。
    // development为开发环境（npm run dev），另外一个production是生产环境（）
    // 生产环境时staticPath的值为'./'，开发环境时staticPath的值为'/static/'。
    staticPath: process.env.NODE_ENV !== 'development' ?  config.build.staticPath: config.dev.staticPath
};
console.log(url.staticPath);

//----------------请注意：如果正式环境，不需要本地json数据模拟，请删除以上代码和api中的模拟接口。----------------

export const api = {
    "menu":url.staticPath+"dataJson/menu.json",//菜单
    "updatePassword":url.staticPath+"dataJson/updatePassword.json",//修改密码
    "findCurUser":url.staticPath+"dataJson/findCurUser.json",//修改密码
    "departData":url.staticPath+"dataJson/departData.json",//组织机构树
    "ruleTable":url.staticPath+"dataJson/ruleTable.json",//规则列表
    "markerTable":url.staticPath+"dataJson/markerTable.json",//规则列表
}
    


