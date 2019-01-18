/**
 * @Author:      qinbb
 * @DateTime:    2018-02-02 13:43:45
 * @Description: 完成对node和npm的版本检测
 */
// chalk, 用于在控制台输出带颜色字体的插件
var chalk = require('chalk');
// semver, 语义化版本检查插件（The semantic version parser used by npm）
var semver = require('semver');
var packageConfig = require('../package.json');//引入依赖包的配置文件
// 开辟子进程执行指令cmd并返回结果
function exec(cmd) {
    return require('child_process').execSync(cmd).toString().trim();
}
//检查node和npm版本信息
var versionRequirements = [
    {
        name: 'node',
        currentVersion: semver.clean(process.version),
        versionRequirement: packageConfig.engines.node
    },
    {
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    }
];

module.exports = function () {
    var warnings = [];
    // 依次判断版本是否符合要求
    for (var i = 0; i < versionRequirements.length; i++) {
        var mod = versionRequirements[i];
        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            const name = mod.name;
            const versions = chalk.red(mod.currentVersion);
            const requments = chalk.green(mod.versionRequirement);
            warnings.push(name + versions + requments);
              /*warnings.push(mod.name + ': ' +
                chalk.red(mod.currentVersion) + ' should be ' +
                chalk.green(mod.versionRequirement)
              );*/
        }
    }
// 如果有警告则将其输出到控制台
    if (warnings.length) {
        console.log(chalk.yellow('To use this template, you must update following to modules:'));
        for (var i = 0; i < warnings.length; i++) {
            var warning = warnings[i];
            console.log('  ' + warning);
        }
        process.exit(1);
    }
}
