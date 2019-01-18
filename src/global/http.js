/**
 * @Author:      qinbb
 * @DateTime:    2018-02-23 14:50:30
 * @Description: 封装axios
 */
import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
import {Message} from 'element-ui';
import router from 'src/router'; 
import store from 'src/store'; 

const instance = axios.create({
    timeout: 50000,               // 请求超时时间
    //baseURL: '/proxy', //所有的接口都会加载
});
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头

//var loadingInstance;//loading组件

//在请求或者返回被then或者catch处理之前对他们进行拦截
//添加一个请求拦截器
instance.interceptors.request.use(config=> {
    /*if(config.method == "get"){
      if(config.params){
        if(!config.params.flags){
          loadingInstance = Loading.service({text:"拼命加载中"});
        }
        delete config.params.flags;//删除对象属性
      }else{
        if(config.param){
          if(!config.param.flags){
            loadingInstance = Loading.service({text:"拼命加载中"});
          }
          delete config.param.flags;//删除对象属性
        }else{
          loadingInstance = Loading.service({text:"拼命加载中"});
        }
      }
    }else if(config.method == "post"){
      if(config.data){
        if(!config.data.flags){
          loadingInstance = Loading.service({text:"拼命加载中"});
        }
        delete config.data.flags;//删除对象属性
      }else{
        loadingInstance = Loading.service({text:"拼命加载中"});
      }
    }*/
    //在发送请求之前做某件事 post序列化
    if(config.method  === 'post'){
    	//去除参数前边的空格
        for (const key in config.data) {
          	if(typeof config.data[key] == 'string'){
            	config.data[key] = $.trim(config.data[key]);
          	}
        } 
      	//在data当中存在数组的话需要加上{arrayFormat: 'brackets'} 否则提交时数组会显示下标
        config.data = qs.stringify(config.data,{arrayFormat: 'brackets'});
    }
    // `params` 是即将与请求一起发送的 URL 参数  params是请求配置中的参数
    config.params = {
        // _t: Date.parse(new Date())/1000,//添加时间戳  IE缓存严重
        ...config.params
    }
    return config;
}, err=> {
  /*if(loadingInstance){
    loadingInstance.close();
  }*/
   //当出现请求错误是做一些事
  Message.error({message: '请求超时!'});
  return Promise.reject(err);
});
//添加一个返回拦截器
instance.interceptors.response.use(data=> {
  /*if(loadingInstance){
    loadingInstance.close();
  }*/
  //401  需要登录 
  if(data.data.status && data.data.status == 401){
    Cookies.remove('refresh');//移除刷新
    store.commit('SET_USERINFO', '');//修改用户
    router.replace({path: '/login'});
    return;
  }
  return data;
}, err=> {
  /*if(loadingInstance){
    loadingInstance.close();
  }*/
  //对返回的错误进行一些处理  状态504  404  403 处理
  if (err && err.response){
      switch (err.response.status) {
        case 302:
          err.message = '错误请求：找不到url请求（后台过滤）';
          break;
        case 400:
          err.message = '错误请求：字段名称、类型前后台不一致';
          break;
        case 401:
          err.message = '未授权，请重新登录';
          router.replace({path: '/login'});//路由跳转 不会向 history 添加新记录，替换掉当前的 history 记录
          break;
        case 403:
          err.message = '拒绝访问';
          router.replace({path: '/error/401'});
          break;
        case 404:
          err.message = '请求错误,未找到该资源';
          router.replace({path: '/error/404'});
          break;
        case 405:
          err.message = '请求方法未允许,可能是请求类型(get post)不一致';
          break;
        case 408:
          err.message = '请求超时';
          break;
        case 500:
          err.message = '服务器端出错';
          break;
        case 501:
          err.message = '网络未实现';
          break;
        case 502:
          err.message = '网络错误';
          break;
        case 503:
          err.message = '服务不可用';
          break;
        case 504:
          err.message = '网络超时';
          router.replace({path: '/error/404'});
          break;
        case 505:
          err.message = 'http版本不支持该请求';
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
  }else{
    err.message = "连接到服务器失败";
  }
  console.log(err.message);
  Message.error({message : err.message});
  return Promise.reject(err);
});

export default instance;


