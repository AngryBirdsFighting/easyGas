/**
 * @Author:      qinbb
 * @DateTime:    2018-01-31 17:47:46
 * @Description: 公共方法工具类
 */
import config from '../../config';
import axios from 'axios';
import instance from 'src/global/http';

   //定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
var direations= ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
var lbsFlagToLbsStrArray = ['未定位', 'gps定位', '北斗定位', 'GLONASS', 'Galileo', '未知'];

export  const utils = {
    //坐标经纬度 倍数10的6次方
    mapDataMultiple: 1000000,
    /**
    * @des  按钮权限的控制
    * @param <Object> vm this
    * @return <Boolean> 看xxx是否成功
    */
    permsButton:function(vm){
        let perms = vm.$store.getters.permission_perms;//按钮权限
        let purl = window.location.href;
        //purl = purl.substr(purl.indexOf(config.dev.port) + 4);//history
        if(purl.substr(purl.indexOf("#") + 1).indexOf('?') != -1){
            purl = purl.substr(purl.indexOf("#") + 1).split('?')[0];
        }else{
          purl = purl.substr(purl.indexOf("#") + 1);//hash  
        }
        let permArr = new Array();
        for(let val in perms){
            if(perms[val].frontRouting == purl){
                permArr = perms[val].perm;//当前路由的按钮的权限
            }
        }
        //将当前路由的按钮设置为true
        if(permArr){
            for(let index in permArr){
                if(vm.permBtn[permArr[index]] != 'undefined'){
                    vm.permBtn[permArr[index]] = true;
                }
            }
        }
        return vm.permBtn;
    },
    /**
     * @des  查找字典项
     * @param <String> par 字典类目code编码
     * @param <Function> callback 回调函数
     * @return <Array> 字典类目code编码的所有子集
     */
     dictsByCode:function(par,callback){
        if(par){
            let param = {};
            param.categoryCode = par;
            param = JSON.parse(JSON.stringify(param));
            instance.get('/proxy/dict/findDictsByCode', {params : param}).then(res =>{
                if(res.status == 200){
                    let result = res.data;
                    typeof callback === 'function' && callback.call(window,result);
                    return result;
                    resolve();//异步操作成功
                }else{
                    Message.error({message:"调用接口失败"});
                }
            }).catch(error => {});
        }
     },
     /**
     * @des  批量查找字典项
     * @param <Array<String>> par 字典类目code编码数组
     * @param <Function> callback 回调函数
     * @return <Object> 字典类目code编码的所有子集
     */
     batchDictsByCode:function(par,callback){
        if(par.length > 0){
            let param = {};
            // param.categoryCodes = JSON.parse(JSON.stringify(par));
            // instance.get('/proxy/dict/findBatchDictsByCode', {params : param}).then(res =>{
            //     if(res.status == 200){
            //         let result = res.data;
            //         typeof callback === 'function' && callback.call(window,result);
            //         return result;
            //         resolve();//异步操作成功
            //     }else{
            //         Message.error({message:"调用接口失败"});
            //     }
            // }).catch(error => {});
        }
     },
        
    /*
     *格式化时间 
     */
    setTime:function( time ){
        let newTime = "";
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        if(month < 10){
            month = "0" + month;
        }
        if(day < 10){
            day = "0" + day;
        }
        return newTime = year + "-" + month + "-" + day;
    },
    /**
     * @des  获取url参数
     * @return <String> GET
     */
    getUrlFn:function(){
        let querystr = window.location.href.split("?"),
        GETs = "",
        GET = "";
        if (querystr[1]) {
            GETs = querystr[1].split("&");
            GET = [];
            for (i = 0; i < GETs.length; i++) {
                tmp_arr = GETs[i].split("=");
                let key = tmp_arr[0];
                GET[key] = tmp_arr[1];
            }
        }
        return GET;
    },
    /**
     * @des  获取url data参数。aa.html?data={}
     * @return <String> GET
     */
     getUrlData: function(){
        let purl = window.location.href;
        purl = purl.substr(purl.indexOf("?") + 1);
        let urlData = JSON.parse(decodeURI(purl.substr(purl.indexOf("=") + 1)));
        return urlData;
     },
     /**
     * @des  资源树控件遍历解析数据(选中，展开)
     * @return 
     */
	paeserPermissionsData: function(data, checkeds, opens) {
        var vm = this;
		$.each(data, function(idx, obj) {
			if (obj.checked) {
				checkeds.push(obj.menuId);
			}
			if (obj.open) {
				opens.push(obj.menuId);
			}
			if (obj.children) {
				vm.paeserPermissionsData(obj.children, checkeds, opens);
			}
		});
    },
    /**
     * @des  获取table高度（返回值只适合于一种特定的页码高度，本函数主要是提供了延时设置功能，可以在回调函数中自己计算高度）
     * @return 
     */
    getTableHeight: function(callback) {
        //延时1MS，直接设置高度没有作用
        let t1 = window.setTimeout(()=>{
            let h = $('.sidebar-wrapper').height();  //左侧路由高度
            let	h3 = $('.navbar').height();  //搜索栏
            let	h1 = $('.filter-container').height();  //搜索栏
            let h2 = $('.pagination-container').height(); //页码
            if (h2) {
            	callback(h - h1 - h2 - h3 - 102);  //92主要是所以margin之和
            } else {
            	callback(h - h1 - h3 - 102);  //92主要是所以margin之和
            }
            window.clearTimeout(t1); //去掉定时器 
        }, 1);
    },
            
    /**
    * @des  设置主内容的默认高度(最小)
    * @return 
    */
    setContentHeight: function() {
        let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//浏览器高度
        $('.apps').css({'height': windowHeight - 80});
    },
    
    /**
    * @des  导出
    * isGet  是否为get请求
    * @return 
    */
    exportLists: function(listQuery, url, isGet = false){
    	let param = JSON.parse(JSON.stringify(listQuery));
        //删除分页
        if (param.iDisplayLength) {
            delete param.iDisplayLength;
        }
        if (param.iDisplayStart) {
            delete param.iDisplayStart;
        }
        
        var type = 'post';
        if (isGet) {
            type = 'get';
        }
        
    	let $iframe = $('<iframe id="down-file-iframe" />');
	    let $form = $('<form method="'+ type +'" />');
	    $form.attr('action', url);
	    for (var key in param) {
	    	$form.append('<input type="hidden" name="' + key + '" value="' + param[key] + '" />');
	    }
	    $iframe.append($form);
	    $(document.body).append($iframe);
	    $form[0].submit();
	    $iframe.remove();
    },

    /**
    * @des  获取当前时间  年月日 时分秒
    * @param <String> type: 1 (年月日) 2（时分秒）3（年月日时分秒）
    * @return <String> 格式化后的日期
    */
    getTodayTime:function(type){
        let now = new Date();  
        let year = now.getFullYear();       //年  
        let month = now.getMonth() + 1;     //月  
        let day = now.getDate();            //日  
        let hh = now.getHours();            //时  
        let mm = now.getMinutes();          //分  
        let ss = now.getSeconds();           //秒 
        let clock = "" ;
        //包含年月日
        if(type == 1 || type == 3){
            clock = year + "-"; 
            if(month < 10){
               clock += "0";  
            }  
            clock += month + "-";  
            if(day < 10){
                clock += "0";
            }  
            clock += day + " "; 
        }
        //包含时分秒
        if(type == 2 || type == 3){
            if(hh < 10){
               clock += "0";  
            }  
            clock += hh + ":";  
            if (mm < 10){
                clock += '0'; 
            }   
            clock += mm + ":";   
            if (ss < 10){
                clock += '0';
            }    
            clock += ss; 
        }
        return(clock); 
    },
    /**
    * @des  报警key转value
    * @param <String> keys: 多个告警逗号分隔
    * @param <String> vm: this
    * @return <String> 转换后的值，多个告警逗号分隔
    */
    convertAlarmType:function(keys, vm){
        let vlaues = "";
        if(!keys || keys.length == 0 || keys == 0){
            vlaues = "暂无数据";
        }else{
            let keyArray = keys.split(',');
            let keyValueObj = vm.$store.getters.alarmData;
            if (!keyValueObj) {
                this.loadAlarmType(vm);
                return keys;
            }
            keyArray.forEach(key => {
                if (key == "") {
                    return;
                }
                if (vlaues != "") {
                    vlaues += ",";
                }
                vlaues += keyValueObj[key];
            });
        }
        return vlaues;
    }, 

    /**
        * @des  加载报警数组
        * @param <String> vm: this
        */
    loadAlarmType: function(vm) {
        if (!vm.$store.getters.alarmData) {
            vm.$store.dispatch('GetAlarmData');
        }
    },

    /**
     * 百度地图，地址逆解析（异步）
     * 
     * @param {any} geoc BMap.Geocoder逆解析对象
     * @param {any} pt   BMap.Point 坐标点
     * @param {any} callback   回调返回解析的值
     */
    getAddress(geoc, pt, callback){
        //异步执行的
        geoc.getLocation(pt, function (rs) {
            var address = "";
            if(rs){
                let addComp = rs.addressComponents;
                address = addComp.province + "" + addComp.city + "" + addComp.district + "" 
                                + addComp.street + "" + addComp.streetNumber;

            }else{
                address = "该地址解析不了";
            }
            callback(address);
        });
    },

   /**
    * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
    * 即 百度 转 谷歌、高德
    * @param bd_lon
    * @param bd_lat
    * @returns {*[]}
    */
    bd09togcj02:function(bd_lon, bd_lat) {
       var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
       var x = bd_lon - 0.0065;
       var y = bd_lat - 0.006;
       var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
       var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
       var gg_lng = z * Math.cos(theta);
       var gg_lat = z * Math.sin(theta);
       return [gg_lng, gg_lat]
    },

    /**
        * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
        * 即谷歌、高德 转 百度
        * @param lng
        * @param lat
        * @returns {*[]}
        */
    gcj02tobd09:function(lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    },

    /**
        * WGS84转GCj02
        * @param lng
        * @param lat
        * @returns {*[]}
        */
    wgs84togcj02:function(lng, lat) {
        if (this.out_of_china(lng, lat)) {
            return [lng, lat]
        } else {
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [mglng, mglat]
        }
    },

    /**
        * GCJ02 转换为 WGS84
        * @param lng
        * @param lat
        * @returns {*[]}
        */
    gcj02towgs84:function(lng, lat) {
        if (this.out_of_china(lng, lat)) {
            return [lng, lat]
        } else {
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [lng * 2 - mglng, lat * 2 - mglat]
        }
    },
    /**
        * 84 转 百度
        * @param lng
        * @param lat
        * @returns {*[]}
        */
    wgs84tobd09:function(lng, lat) {
        var gcj02 = this.wgs84togcj02(lng, lat);
        return this.gcj02tobd09(gcj02[0], gcj02[1]);
    },

    /**
        *  百度 转  84
        * @param lng
        * @param lat
        * @returns {*[]}
        */
    bd09towgs84:function(lng, lat) {
        var gcj02 = this.bd09togcj02(lng, lat);
        return this.gcj02towgs84(gcj02[0], gcj02[1]);
    },

    transformlat:function(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    },

    transformlng:function(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    },

    /**
        * 判断是否在国内，不在国内则不做偏移
        * @param lng
        * @param lat
        * @returns {boolean}
        */
    out_of_china:function(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    },

    /**
     * 根据基站信号强度数字，获取基站信号强度图片。分为5个等级
     * simSignal范围5-31， 大于25算5级（最强），大于20算4级，大于15算3级，大于10算4级，小于10算1级（最弱）,99无信号
     */
    getSimSignalClass: function(simSignal) {
        var grade = 1;
        if (simSignal >= 25) {
            if (simSignal == 99) {
                grade = 0;
            } else {
                grade = 5;
            }
        } else if (simSignal >= 20) {
            grade = 4;
        } else if (simSignal >= 15) {
            grade = 3;
        } else if (simSignal >= 10) {
            grade = 2;
        } else {
            grade = 1;
        }

        var simSignalIconClass = "simSignalIconClass_" + grade;
        return simSignalIconClass;
    },
    /**
     * 角度转方向  
     * direation： 0-359   0为正北，顺时针
     * 返回值为方向字符串，如：“北”
     */
    angleToDireation: function(direation) {
        var index = 0;

        if ((direation >= 350 && direation < 360) || direation < 10) {
            index = 0;
        } else if (direation >= 10 && direation < 80) {
            index = 1;
        } else if (direation >= 80 && direation < 100) {
            index = 2;
        } else if (direation >= 100 && direation < 170) {
            index = 3;
        } else if (direation >= 170 && direation < 190) {
            index = 4;
        } else if (direation >= 190 && direation < 260) {
            index = 5;
        } else if (direation >= 260 && direation < 280) {
            index = 6;
        } else if (direation >= 280 && direation < 350) {
            index = 7;
        } else {
            return "未知";
        }

        return direations[index];
    },
    
    /**
     * 定位标识转换为字符串
     */
    lbsFlagToLbsStr: function(lbsFlag) {
        //定位状态(定位：多个逗号分隔) 0：未定位 1：gps定位 2：北斗定位 3：GLONASS 4：Galileo 
        let newAlarmArr = [];
        if(lbsFlag){
            let alarmArr = lbsFlag.split(",");
            for (var i=0; i < alarmArr.length; i++) {
                if (alarmArr[i] != "") {
                    if (alarmArr[i] >= 0 && alarmArr[i] < 5) {
                        newAlarmArr.push(lbsFlagToLbsStrArray[alarmArr[i]])
                    } else {
                        newAlarmArr.push(lbsFlagToLbsStrArray[5]);
                    }
                } else {
                    break;
                }
            }
        } else {
            newAlarmArr.push(lbsFlagToLbsStrArray[5]);
        }
        return newAlarmArr.toString();
    },
    /**
     * acc状态转换
     */
    accFlagToStr: function(accFlag) {
        //acc开关 0：关闭 1：打开
        if(accFlag == 0){
            return "ACC关闭";
        }else if(accFlag == 1){
            return "ACC打开";
        }else{
            return "ACC未知";
        }
    },
    /**
     * 在线状态转换
     */
    onlineFlagToStr: function(online) {
		if(online == 1) {
			return "在线";
		} else if(online == 0) {
			return "离线";
		} else if(online == 2) {
			return "怠速";
		}
    },
    /**
     * 删除是否返回上一页 
     * currentPage:当前页   total：总条数  pageLength:每一页的条数
     * return true返回上一页   false刷新当前页
     */
    deleteIsBackBeforePage(currentPage, total, pageLength) {
        if (currentPage == 1 || currentPage < Math.ceil(total / pageLength)) {
            return false;
        }
        else if (total % pageLength == 1) {
            return true;
        } else {
            return false;
        }
    },
    
    //转化时间(默认时间的获取)
	turnTime(time){
		let newDataTime = "";
		if(typeof time == 'string'){//time = "2018-05-01"
			newDataTime = time;
		} else {//time = Thu May 10 2018 17:55:10 GMT+0800 (中国标准时间)
			newDataTime = time.getFullYear() + '-' + this.checkTimeAdd0(time.getMonth() + 1) + '-' + this.checkTimeAdd0(time.getDate());
		}
		return newDataTime;
	},
	
	//时间<10,添0
	checkTimeAdd0(i){
		if (i<10){
			i = "0" + i;
		}
		return i;
	},
 };


