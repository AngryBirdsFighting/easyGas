/** * @Author: qinbb * @DateTime: 2018-03-16 16:56:54 * @Description: 百度地图组件 */
<!-- 页面模版 -->
<template>
	<div>
		<div id="allmap" class="map">
		</div>
	</div>
</template>
<script>
	import { utils } from 'src/utils';
	export default {
		components: {},
		data (){
			return{
                map:{}
			}
		},
		props:{
			alarmCar: {
				type: Object,
				default: {}
            }
		},
		created() {},
		mounted() {
			this.ready(); //加载地图
		},
		methods: {
			ready: function() {
				// 百度地图API功能
				this.map = new BMap.Map("allmap"); // 创建Map实例
				// this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
				// //添加地图类型控件
				// this.map.addControl(new BMap.MapTypeControl({
				// 	mapTypes: [
				// 		BMAP_NORMAL_MAP,
				// 		BMAP_HYBRID_MAP
				// 	]
				// }));
				this.map.centerAndZoom("北京", 5);  // 初始化地图,设置中心点坐标和地图级别
				this.map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
				this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
			},
			monitorPlace(){
				this.map.clearOverlays(); 
				let vm = this
				var  a;
				let geoc = new BMap.Geocoder();//百度地图逆解析
				var bd09 = utils.wgs84tobd09(parseFloat(vm.alarmCar.longitude),parseFloat(vm.alarmCar.latitude));
				vm.alarmCar.longitude = bd09[0];
				vm.alarmCar.latitude = bd09[1];
				let pt = new BMap.Point(vm.alarmCar.longitude,vm.alarmCar.latitude);
				utils.getAddress(geoc, pt, (address)=> {
					a = address;
					vm.$emit('showCityName',a);
				});
				vm.map.centerAndZoom(pt, 11);  // 初始化地图
				vm.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
				let imgSrc = "";
				//修改图标
				if(vm.alarmCar.online == 0){
					imgSrc = require("assets/img/map-out.png");;//离线
				}else if(vm.alarmCar.online == 1){
					imgSrc = require("assets/img/map-online.png");//1：在线
				}else if(vm.alarmCar.online == 2){
					imgSrc = require("assets/img/map-stop.png");//2：怠速
				}
				let myIcon = new BMap.Icon(imgSrc, new BMap.Size(30,30));
				let marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
				vm.map.addOverlay(marker);             // 将标注添加到地图中
				marker.disableDragging();           // 不可拖拽
				vm.alarmCar.direation = utils.angleToDireation(vm.alarmCar.direation);
				//添加弹框
				var opts = {
					width : 0,     // 信息窗口宽度
					height: 0,     // 信息窗口高度
//					title : vm.alarmCar.carNum, // 信息窗口标题 车牌号
					enableMessage:true,//设置允许信息窗发送短息
					message:""
				}
				
				let infos = "<div class='mapDialog'>"
					+ "<span class='BMap_car_title'>" + vm.alarmCar.carNum + "</span> "// 信息窗口标题 车牌号
					+ "<span class='simSignalIconClass " + utils.getSimSignalClass(vm.alarmCar.simSignal) + "'></span> "
					+ "<span class='satelliteIcon'></span><span>" + vm.alarmCar.satelliteNum + "个</span> "
					+ "</div>"
					+ "<div class='mapDialog'>定位时间：" + vm.alarmCar.gpsTime + "</div>"
					+ "<div class='mapDialog'>通讯时间：" + vm.alarmCar.linkTime + "</div>"
					+ "<div class='mapDialog'>速度：" + vm.alarmCar.speed + "km/h" + "(" + vm.alarmCar.direation + ")</div>"
					+ "<div class='mapDialog'>里程：" + vm.alarmCar.mileage + "km</div>"
					+ "<div class='mapDialog'>状态：(" + utils.onlineFlagToStr(vm.alarmCar.online) + ")" + utils.accFlagToStr(vm.alarmCar.acc) + "</div>"
				
				var infoWindow = new BMap.InfoWindow(infos, opts);  // 创建信息窗口对象
				vm.map.openInfoWindow(infoWindow,pt); //开启信息窗口  
				marker.addEventListener("click",function(e){
					vm.map.openInfoWindow(infoWindow,pt); //开启信息窗口
				});      
				
			},
			
		}
	}
</script>
<style rel="stylesheet/scss" scoped lang="scss">
	@import "src/assets/css/mixin.scss";
	/* 去掉地图左下角的百度LOGO */
	
	.anchorBL {
		display: none
	}

</style>