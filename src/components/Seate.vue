/** * @Author: qinbb * @DateTime: 2018-03-28 10:32:16 * @Description: 查看位置组件 */
<template>
	<!-- 导入 -->
	<el-dialog title="查看位置" class="seate" :visible.sync="seateVisible.dialog" :show-close="seateClose" top="8%" width="60%" lock-scroll :close-on-click-modal="false" :close-on-press-escape="false">
		<div style="padding-bottom:20px">
			<div id="alarmMap" class="alarmMap"></div>
			<div v-if="seateVisible.tables">
				<h3>查看明细</h3>
				<!-- 表格 -->
				<el-table ref="multipleTable" :data="list" fit highlight-current-row>
					<el-table-column align="center" label='acc开关' prop="acc"></el-table-column>
					<el-table-column align="center" label="参考位置" prop="address"></el-table-column>
					<el-table-column align="center" label="告警标识" prop="alarmType"></el-table-column>
					<el-table-column align="center" label="车牌号" prop="carNum"></el-table-column>
					<el-table-column align="center" label="方向角" prop="direation"></el-table-column>
					<el-table-column align="center" label="定位时间" prop="gpsTime"></el-table-column>
					<el-table-column align="center" label="定位状态" prop="lbsFlag"></el-table-column>
					<el-table-column align="center" label="里程" prop="mileage"></el-table-column>
					<el-table-column align="center" label="在线标识" prop="acc"></el-table-column>
					<el-table-column align="center" label="基站信号" prop="simSignal"></el-table-column>
					<el-table-column align="center" label="速度" prop="speed"></el-table-column>
					<el-table-column align="center" label="纬度" prop="startLat"></el-table-column>
					<el-table-column align="center" label="经度" prop="startLng"></el-table-column>
				</el-table>
			</div>
		</div>
		<div>
			<el-button type="primary" icon="el-icon-close" class="btnColor closeBtn" @click.native.prevent="canelImport"></el-button>
		</div>
	</el-dialog>

</template>

<script>
	import { Message } from 'element-ui';
	import { utils } from 'src/utils';
	export default {
		name: 'Seate',
		// 声明 props
		props: ['seateVisible'],
		data() {
			return {
				seateClose: false, //不显示自带的关闭按钮
				list: [], //明细
				alarmCar: {

				},
				geoc: null,
			};
		},
		mounted() {
			//只有点击查看位置才加载
			if(this.seateVisible.dialog) {
				this.initAlarm(); //查看告警详情
				// this.addMarker();
			}
			this.geoc = new BMap.Geocoder(); //百度地图逆解析
		},
		watch: {

		},
		methods: {
			//创建marker
			addMarker() {
				let map = new BMap.Map("alarmMap"); // 创建Map实例
				let vm = this;
				let pt = new BMap.Point(vm.alarmCar.startLng, vm.alarmCar.startLat);
				map.centerAndZoom(pt, 18); // 初始化地图
				map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
				let imgSrc = "";
				//修改图标
				if(vm.alarmCar.online == 0) {
					imgSrc = require("assets/img/map-out.png");; //离线
				} else if(vm.alarmCar.online == 1) {
					imgSrc = require("assets/img/map-online.png"); //1：在线
				} else if(vm.alarmCar.online == 2) {
					imgSrc = require("assets/img/map-stop.png"); //2：怠速
				}
				let myIcon = new BMap.Icon(imgSrc, new BMap.Size(30, 30));
				let marker = new BMap.Marker(pt, {
					icon: myIcon
				}); // 创建标注
				map.addOverlay(marker); // 将标注添加到地图中
				marker.disableDragging(); // 不可拖拽
				let span1 = ""; //怠速时长数据
				//修改数据
				if(vm.alarmCar) {
					vm.alarmCar.acc = utils.accFlagToStr(vm.alarmCar.acc);
					vm.alarmCar.lbsFlag = utils.lbsFlagToLbsStr(vm.alarmCar.lbsFlag);
					vm.alarmCar.alarmType = utils.convertAlarmType(vm.alarmCar.alarmType, vm);
					vm.alarmCar.direation = utils.angleToDireation(vm.alarmCar.direation);

					//在线标识 0：离线 1：在线 2：怠速
					if(vm.alarmCar.online == 2) {
						if(vm.alarmCar.idlingDuration != undefined) {
							vm.alarmCar.minute = parseInt(vm.alarmCar.idlingDuration / 60); //分
							vm.alarmCar.seconds = vm.alarmCar.idlingDuration % 60; //秒
							span1 = " 怠速" + (vm.alarmCar.minute != 0 ? vm.alarmCar.minute + "分" : "") + vm.alarmCar.seconds + "秒";
						}
					}
					vm.alarmCar.online = utils.onlineFlagToStr(vm.alarmCar.online);
				}
				//添加弹框
				var opts = {
					width: 0, // 信息窗口宽度
					height: 0, // 信息窗口高度
//					title: vm.alarmCar.carNum, // 信息窗口标题 车牌号
					enableMessage: true, //设置允许信息窗发送短息
					message: ""
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
					+ "<div class='mapDialog'>状态：(" + vm.alarmCar.online + ")" + vm.alarmCar.acc + (span1 != ""? span1: "") + "</div>"
					+ "<div class='mapDialog'>报警类型：" + vm.alarmCar.alarmType + "</div>"
					+ "<div class='mapDialog'>位置：" + vm.alarmCar.address + "</div>"
				
				var infoWindow = new BMap.InfoWindow(infos, opts); // 创建信息窗口对象 
				marker.addEventListener("mouseover", function() {
					if(map.getInfoWindow() != infoWindow) {
						map.closeInfoWindow();
						map.openInfoWindow(infoWindow, pt); //开启信息窗口
					}
				});
			},
			//查看告警详情
			initAlarm() {
				let vm = this;
				let params = {};
				params.alarmId = vm.seateVisible.alarmId; //告警ID
				params = JSON.parse(JSON.stringify(params));
				//查看告警详情
				vm.$instance.get("/proxy/lbs/alarm/findAlarmInfo", {
					params: params
				}).then(res => {
					if(res.status == 200) {
						//84转百度
						let bd09 = utils.wgs84tobd09(res.data.startLng, res.data.startLat);
						res.data.startLng = bd09[0];
						res.data.startLat = bd09[1];
						//获取位置信息
						var mapPos = new BMap.Point(res.data.startLng, res.data.startLat);
						utils.getAddress(vm.geoc, mapPos, (address) => {
							res.data.address = address;
							vm.alarmCar = res.data;
							vm.addMarker();
							vm.list = [];
							vm.list.push(res.data);
						});
					} else {
						Message.error({
							message: "调用接口失败"
						});
					}
				}).catch(error => {});

			},
			//修改父组件的值
			canelImport() {
				this.$emit('changeSeate', false);
			},
		}
	};
</script>
<style rel="stylesheet/scss" scoped lang="scss">
	@import "src/assets/css/mixin.scss";
	.closeBtn {
		position: absolute;
		top: 5px;
		right: 0;
		font-size: 16px;
		outline: none;
		border: none;
		&:hover {
			color: red;
			background: #67d3e0;
		}
	}
	
	.alarmMap {
		width: 100%;
		height: 400px;
		border: 1px solid gray;
		overflow: hidden;
	}
</style>