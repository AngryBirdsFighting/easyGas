/**
 * @Author:      qinbb
 * @DateTime:    2018-01-31 18:19:34
 * @Description: 校验
 */
export const validate = {
    /**
     * @des  form校验提取
     * @param <Object> vm this
     * @param <String> formName ref名称
     * @param <String> params form提交的参数
     * @return <Boolean> 看xxx是否成功
     */
    isValidate: function(vm, formName, callBack, params = {}) {
        let formData = {};
        formData.validates = false;
        vm.$refs[formName].validate((valid) => {
            if (valid) {
                formData.param = JSON.parse(JSON.stringify(params));
                console.log('form参数json格式化：', formData.param);
                formData.validates = true;
            } else {
                formData.validates = false;
            }
            callBack(formData);
        });
    },
    /**
     * @des  是否邮箱
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    isEmail: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('邮箱不能为空！'));
            return;
        }
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('请输入正确的合法邮箱'));
        } else {
            callback();
        }
    },
    /**
     * @des  密码不少于6位 不大于20位
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validatePass: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('6~20位数字、英文、符号至少两种的组合'));
            return;
        }
        const reg = /(?!.*\s)(?!^[\u4E00-\u9FA5]+$)(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^\u4E00-\u9FA5a-zA-Z\d]+$)^.{6,20}$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('6~20位数字、英文、符号至少两种的组合'));
        } else {
            callback();
        }
    },
    /**
     * @des  合法uri
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateURL: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('url不能为空！'));
            return;
        }
        const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('请输入合法URL'));
        } else {
            callback();
        }
    },
    /**
     * @des  是否为小写字母
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateLowerCase: function(rule, value, callback) {
        const reg = /^[a-z]+$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('字母需小写'));
        } else {
            callback();
        }
    },
    /**
     * @des  是否为大写字母
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateUpperCase: function(rule, value, callback) {
        const reg = /^[A-Z]+$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('字母需大写'));
        } else {
            callback();
        }
    },
    /**
     * @des  是否为正整数
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateNumber: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('不能为空！'));
            return;
        }
        const reg = /^[0-9]+$/;
        let falg = reg.test(value);
        if (!falg) {
            callback(new Error('请输入正整数'));
        } else {
            callback();
        }
    },
    /**
     * @des  是否为IP
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateIP: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('Ip不能为空！'));
            return;
        }
        const reg = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('请输入正确的IP地址'));
        } else {
            callback();
        }
    },
    /**
     * @des  是否为port
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validatePort: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('端口不能为空！'));
            return;
        }
        const reg = /^[0-9]+$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('请输入正确的端口号'));
        } else {
            if (value > "65535") {
                callback(new Error('请输入正确的端口号(小于65536)'));
            } else {
                callback();
            }
        }
    },
    /**
     * @des  备份服务器Ip校验  可以为空
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateBackupIP: function(rule, value, callback) {
        const reg = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
        if (value == "") {
            callback();
        } else {
            let falg = reg.test(value.trim());
            if (!falg) {
                callback(new Error('请输入正确的IP地址(可以为空)'));
            } else {
                callback();
            }
        }
    },
    /**
     * @des  是否为大小写字母
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateAlphabets: function(rule, value, callback) {
        const reg = /^[A-Za-z]+$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('只能输入字母'));
        } else {
            callback();
        }
    },
    /**
     * @des  是否为手机号码
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateTelphone: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('手机号不能为空！'));
            return;
        }
        const reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/; //11位手机号
        const regexp = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/; //座机
        let falg = reg.test(value.trim()) || regexp.test(value.trim());
        if (!falg) {
            callback(new Error('请输入正确的手机号或座机'));
        } else {
            callback();
        }
    },
    /**
     * @des  是否车牌号
     * @param <Object> rule 校验规则参数
     * @param <String> value form表单但校验的值
     * @return <Function>  callback 回调函数
     */
    validateCarNum: function(rule, value, callback) {
        if (value === '' || value === null) {
            callback(new Error('车牌号不能为空！'));
            return;
        }
        const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        let falg = reg.test(value.trim());
        if (!falg) {
            callback(new Error('请输入正确的合法车牌号'));
        } else {
            callback();
        }
    },

};