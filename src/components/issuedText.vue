<template>
	<el-dialog title="下发文字信息" :visible.sync="isShow" :close-on-press-escape="false"  :close-on-click-modal = "false" @close="closeDialog" top="10%" width="645px" height="335px" lock-scroll class="boxres equimei-dialog">
		<div class="issued">
			<div class="issued-text"  @keyup.enter="handleIssuedText">
				<el-input type="textarea" :maxlength="210" :rows="8" placeholder="发送窗口，(按Enter键发送消息)" v-model="textarea">
				</el-input>
			</div>

			<div class="issued-car">
				<div class="car-online" v-if="car">
					<span>车队列表（{{car.onLine.length}}）</span>
					<ul v-if="car.onLine.length > 0">
						<li v-for="(item, index) in car.onLine" :key="index">
							<span :title="item.status == 1 ? '在线' : item.status == 2 ? '怠速' : '告警'"  class="car-img" :class="item.status == 1 ? 'caronline' : item.status == 2 ? 'carstop' : 'cartip'"> </span>&nbsp;{{item.carName}}
						</li>
					</ul>
					<p v-else>没有车辆</p>
				</div>
				<div class="car-unonline" v-if="car">
					<span>不可下发（{{car.unOnLine.length}}）</span>
					<ul v-if="car.unOnLine.length > 0">
						<li v-for="(item, index) in car.unOnLine" :key="index">
							<span :title="item.status == 0 ?   '离线' : '未激活'" class="car-img " :class="item.status == 0 ?   'caroutline' : 'carnoactive'"></span> &nbsp;{{item.carName}}
						</li>
					</ul>
					<p v-else>没有车辆</p>
				</div>
			</div>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="closeDialog">取 消</el-button>
			<el-button type="primary" @click.native.prevent="handleIssuedText" class="btnColor">发送</el-button>
		</div>
		<div class="close">
			<i @click="closeDialog" class="el-icon-close"></i>
		</div>
	</el-dialog>
</template>

<script type="text/javascript">
	import { Message } from 'element-ui';
	export default {
		data() {
			return {
				params: [], // 请求参数
				textarea: "" // 文字内容
			}
		},
		props: {
			isShow: {//弹窗显示
				default: false,
				type: Boolean
			},
			carList: {//选中数据
				default: [],
				type: Array
			}
		},
		computed: {
			car() {
				let a = {
					onLine:[],
					unOnLine:[]
				}
				if(this.carList.length > 0) {
					this.carList.forEach(item => {
						if(item.status == 0 || item.status == 4) {
							a.unOnLine.push({
								carName: item.name,
								status: item.status
							})
						} else {
							a.onLine.push({
								carName: item.name,
								status: item.status
							})
							if(this.params.toString().indexOf(item.carId) == -1){
								this.params.push(item.carId)
							}					
						}
					})
				}
				return a
			}
		},
		methods: {
			closeDialog() {
				this.textarea ="";
				this.params = [];
				this.$emit("closeDialog")
            },
			handleIssuedText() {
				let vm = this;
				if(this.params.length == 0){
					vm.$message({
						message: '重新选择车辆进行文本下发操作',
						type: 'error',
						duration: '1500'
					});
					return
				}
				if(!vm.textarea) {
					vm.$message({
						message: '请输入内容',
						type: 'error',
						duration: '1500'
					});
					return
				}

				let params = {
					carIds: this.params,
					content: vm.textarea
				}
				vm.$instance.post("/proxy/lbs/car/downtts", params).then(res => {
					if(res.status == 200) {
						if(res.data.success) {
							Message.success({message: "下发成功！"});
							vm.closeDialog()
						} else {
							Message.error({message: res.data.errorMsg});
						}
					} else {
						Message.error({message: "调用接口失败"});
					}
				}).catch(error => {
					Message.error({message: "调用接口失败"});
				});
			}
		}
	}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
	.issued {
		width: 96%;
		margin: 0 auto;
		&>div {
			display: inline-block;
			height: 180px;
		}
		& .issued-text {
			width: 70%;
			margin-right: 4%;
		}
		& .issued-car {
			padding: 5px 0 0 10px;
			font-size: 12px;
			overflow: auto;
			border: 1px solid #c0c4cc;
			width: 25%;
			& .car-unonline {
				margin-top: 5px
			}
			& ul {
				margin-left: 10px;
				& li {
					margin-top: 5px;
					& span {
						display: inline-block;
						width: 15px;
						height: 15px;
						vertical-align: top;
					}
				}
			}
			& p{
				margin:5px 0 5px 0;
				padding-left: 30px;
				font-size: 15px;
				color:#909399
			}
		}
	}
	
	.dialog-footer {
		text-align: center;
		.btnColor {
			margin-left: 150px;
		}
	}
.close{
	width: 30px;
	height: 44px;
	background: #67d3e0;
	position: absolute;
	top: 0;
	left: 610px;
	font-size: 18px;
	padding: 11px 0 15px 0;
	& .el-icon-close{
		cursor: pointer;
        color:  white;
	}
	& .el-icon-close:hover{
        color: #e12c28
	}
}
</style>