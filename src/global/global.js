/**
 * @Author:      qinbb
 * @DateTime:    2018-01-31 18:25:34
 * @Description: 封装接口处理  get、post
 */
import Vue from 'vue';
import VueResource from 'vue-resource';//类似于jquery的ajax
import { Loading } from 'element-ui';
import Cookies from 'js-cookie';
import config from '../../config';
import themeArray from './themeArray';

Vue.use(VueResource);//vue调用插件

//封装一些全局元素。如全站通用功能函数和http请求等
export  const global = {
    // 开发环境 后台接口的地址及端口
    baseUrl: "http://192.168.1.120:8085/mockjsdata/4/auth",
    baseImgUrl: "", //图片服务器，若没有单独服务，可忽略此项
    staticPath: process.env.NODE_ENV !== 'development' ?  config.build.staticPath: config.dev.staticPath,//开发和生产环境下的静态资源路径
    /**
     * 切换主题函数
     */
    changeTheme:function(themeValue){
        var that = this;
        console.log('切换主题颜色值：',themeValue,that.staticPath,JSON.stringify(themeArray) );
        //需要移到单独的文件存放
        var cssArray = themeArray;

        for (let i = 0 ,len = cssArray.length; i < len; i++) {
            var itemPath = that.staticPath+'/theme/'+themeValue+'/'+cssArray[i].toLowerCase()+'.css';
            loadCss(itemPath);
        };
        
        localStorage.setItem("themeValue",themeValue)

        function loadCss(path){
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
                link.href = path;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
          
        }
    },
    /**
     * 统一接口处理：get请求方法封装。this.$http.get(url, [options])
     * @param url { String } -必选 接口url
     * @param options { Object } -必选 含官方的所有options对象。传参为{params:{key:11}}
     * @param sucCb { Function } -必选 成功回调
     * @param errorCb { Function } -可选 失败回调
     * @param isLoading { Boolean } -可选 是否显示加载状态
     * @param isLogin { Boolean } -可选 是否登陆信息（移动端使用得较多，设置头部信息）
     */
    get:function( url,options = {},sucCb,errorCb,isLoading = true,isLogin ){
        if(!url){
            console.log('接口url不能为空！');
            return false ;
        }
        //遮罩层
        if(isLoading){
            var loadingInstance = Loading.service({text:"拼命加载中"});
        }
        Vue.http.get(url, options).then((response) => {
            // 响应成功回调
            console.log('成功回调');
            setTimeout(function(){
                sucCb(response);
                if(isLoading){
                    loadingInstance.close();
                }
            },1000)
        }, (response) => {
            // 响应错误回调
            console.log('失败回调');
            errorCb(response);
            if(isLoading){
               loadingInstance.close();
            }
        })
    },

    /**
     * 统一接口处理：post请求方法封装。this.$http.get(url, [options])
     * @param url { String } -必选 接口url
     * @param body { Object } -必选 含官方的所有body对象，可为null。传参时不需要参数名，例如body为{key:11}
     * @param options { Object } -必选 含官方的所有options对象，可为null。传参为{params:{key:11}}
     * @param sucCb { Function } -必选 成功回调
     * @param errorCb { Function } -可选 失败回调
     * @param isLoading { Boolean } -可选 是否显示加载状态
     * @param isLogin { Boolean } -可选 是否登陆信息（移动端使用得较多，设置头部信息）
     */
    post:function( url,body,options,sucCb,errorCb,isLoading = true,isLogin ){
        if(!url){
            console.log('接口url不能为空！');
            return false ;
        }
        //遮罩层
        if(isLoading){
            var loadingInstance = Loading.service({text:"拼命加载中"});
        }
        Vue.http.post(url,body,options).then((response) => {
            // 响应成功回调
            console.log('成功回调');
            sucCb(response);
            if(isLoading){
               loadingInstance.close();
            }
        }, (response) => {
            // 响应错误回调
            console.log('失败回调');
            errorCb(response);
            if(isLoading){
               loadingInstance.close();
            }
        })
    },
    
    /*
     *格式化时间 
     */
	setTime:function( time ){
		var newTime = "";
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var day = time.getDate();
		if(month < 10){
			month = "0" + month;
		}
		
		if(day < 10){
			day = "0" + day;
		}
		
		return newTime = year + "-" + month + "-" + day;
	}
};
