/*** 
 * @Author: qiaozp
 * @DateTime: 2018-07-26 09:34:10 
 * @Description: 月份范围选择
 */
<template>
	<div class="month-packer">
		<el-date-picker v-model="startDate" ref="start" type="month" placeholder="开始日期" :picker-options="endDateOpt"></el-date-picker>
		<span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
		<el-date-picker v-model="endDate" ref="end" type="month" placeholder="结束日期" :picker-options="endDateOpt"></el-date-picker>
	</div>
</template>

<script>
	export default {
		name: 'DateMonthPicker',
		data() {
			const vm = this;
			return {
				startDate: "",
				endDate: "",
				endDateOpt: {
		        	disabledDate: (time) => {
		                return time.getTime() > new Date().getTime();
		            }
		        },
			};
		},
		watch: {
	      	startDate(newVal, oldVal){
	      		if(newVal){
	      			this.valiStartDate();
	      			this.$emit("changStartDate", this.setDate(this.startDate));
	      		} else {
	      			this.$emit("changStartDate", this.startDate);
	      		}
	      	},
	      	endDate(newVal, oldVal){
	      		if(newVal){
	      			this.valiEndDate();
	      			this.$emit("changEndDate", this.setDate(this.endDate));
	      		} else {
	      			this.$emit("changEndDate", this.endDate);
	      		}
	      	},
	    },
		//计算属性
		mounted() {
			
		},
		methods: {
			//格式化时间
			setDate(date) {
				let nowVal;
				if(typeof(date) == "object"){
					let Year = date.getFullYear();
					let Month = date.getMonth() + 1;
					if(Month < 10){
						Month = "0" + Month;
					}
					return nowVal = Year + "-" + Month;
				} else {
					return nowVal;
				}
			},
			//验证时间
			valiStartDate(){
				if (this.startDate && this.endDate) {
					let startY = this.setDate(this.startDate).substring(0,4);
					let endY = this.setDate(this.endDate).substring(0,4);
					let startM = this.setDate(this.startDate).substr(this.setDate(this.startDate).length - 2);
					let endM = this.setDate(this.endDate).substr(this.setDate(this.endDate).length - 2);
					if( endY < startY ){
						this.$message({
				          	message: '请选择正确的开始时间！',
				          	type: 'warning',
				          	duration: '1500'
				        });
						this.startDate = "";
						return;
					}else if(startY == endY && endM < startM){
						this.$message({
				          	message: '请选择正确的开始时间！',
				          	type: 'warning',
				          	duration: '1500'
				        });
						this.startDate = "";
						return;
					}
				}
			},
			valiEndDate(){
				if (this.startDate) {
					let startY = this.setDate(this.startDate).substring(0,4);
					let endY = this.setDate(this.endDate).substring(0,4);
					let startM = this.setDate(this.startDate).substr(this.setDate(this.startDate).length - 2);
					let endM = this.setDate(this.endDate).substr(this.setDate(this.endDate).length - 2);
					if( endY < startY ){
						this.$message({
				          	message: '请选择正确的结束时间！',
				          	type: 'warning',
				          	duration: '1500'
				        });
						this.endDate = "";
						return;
					}else if(startY == endY && endM < startM){
						this.$message({
				          	message: '请选择正确的结束时间！',
				          	type: 'warning',
				          	duration: '1500'
				        });
						this.endDate = "";
						return;
					}
				} else {
					this.$message({
			          	message: '请选择开始时间！',
			          	type: 'warning',
			          	duration: '1500'
			        });
					this.endDate = "";
					return;
				}
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss">
	.month-packer>div {
		width: 130px !important;
	}
</style>