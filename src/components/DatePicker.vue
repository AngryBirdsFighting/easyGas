/*** 
 * @Author: qinbb 
 * @DateTime: 2018-03-13 16:14:10 
 * @Description: 年月日范围选择（带有快捷键） 
 */
<template>
	<el-date-picker 
		v-model="datePicker" 
		type="daterange" 
		align="left" 
		unlink-panels 
		range-separator="至" 
		start-placeholder="开始日期" 
		end-placeholder="结束日期" 
		:picker-options="pickerOptions" 
		:id = "dateIdArr"
		value-format="yyyy-MM-dd">
	</el-date-picker>
</template>

<script>
	import { utils } from 'src/utils';
	export default {
		name: 'DatePicker',
		props: ['isTodayBefore','isToday'],
		data() {
			const vm = this;
			return {
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}],
					disabledDate: function(time) {
						if(vm.isTodayBefore) {
							return time.getTime() > new Date().getTime();
						} else {
							return false;
						}
					},
					/*onPick: function(time){
						if(time.minDate && !time.maxDate){
							console.log(time.minDate);
							console.log(time.maxDate);
							time.flag = true;
							this.$children[0].disabledDate(time);
						}
					}*/
				},
				datePicker: '',
				dateIdArr: ['start' + Math.random(),'end' + Math.random()],//日期组件id
			};
		},
		//计算属性
		mounted() {
			/*if(this.isToday){
				console.log(utils.getTodayTime(1));
				let arr = utils.getTodayTime(1).split('-');
				this.datePicker = [new Date(arr[0], parseInt(arr[1])-1, arr[2]), new Date(arr[0], parseInt(arr[1])-1, arr[2])];
			}*/
		},
	};
</script>