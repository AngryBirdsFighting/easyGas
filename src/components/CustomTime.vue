/** * 
 * * @Author: qiaozp 
 * @DateTime: 2018-03-30 14:14:10 
 * @Description: 年月日(自定义选择) 
 */
<template>
	<div class="custom-time">
		<div class="fl custom-year">
			<div class="custom" @click="showDate1">
				<el-input placeholder="选择日期" v-model="yearTime1" :disabled="myDisabled" class="no-padding">
					<i slot="prefix" class="el-input__icon el-icon-date"></i>
				</el-input>
				<i class="el-icon-error closeI" @click="clearData1($event)"></i>
			</div>
			<div class="year-box" v-show="isShow1">
				<div class="el-time-panel__content has-seconds">
					<div class="el-time-spinner has-seconds">
						<div class="el-time-spinner__wrapper el-scrollbar">
							<div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -8px; margin-right: -9px;">
								<ul class="el-scrollbar__view el-time-spinner__list year">
									
								</ul>
							</div>
						</div>
						<div class="el-time-spinner__wrapper el-scrollbar">
							<div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -8px; margin-right: -9px;">
								<ul class="el-scrollbar__view el-time-spinner__list month">
									
								</ul>
							</div>
						</div>
						<div class="el-time-spinner__wrapper el-scrollbar">
							<div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -8px; margin-right: -9px;">
								<ul class="el-scrollbar__view el-time-spinner__list day">
							
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="el-time-panel__footer">
					<button type="button" class="el-time-panel__btn cancel" @click="cancelTime1($event)">取消</button>
					<button type="button" class="el-time-panel__btn confirm" @click="confirmTime1($event)">确定</button>
				</div>
			</div>
		</div>
		<el-time-picker class="fl no-padding" 
			v-model="dayTime1" 
			:picker-options="{selectableRange: ''}" 
			value-format="HH:mm:ss"
			placeholder="选择时间"
			:disabled="myDisabled">
		</el-time-picker>
		<span class="fl text-con">&nbsp;&nbsp;至&nbsp;&nbsp;</span>
		<div class="fl custom-year">
			<div class="custom" @click="showDate2">
				<el-input placeholder="选择日期" :disabled="myDisabled" v-model="yearTime2" class="no-padding">
					<i slot="prefix" class="el-input__icon el-icon-date"></i>
				</el-input>
				<i class="el-icon-error closeI" @click="clearData2($event)"></i>
			</div>
			<div class="year-box" v-show="isShow2">
				<div class="el-time-panel__content has-seconds">
					<div class="el-time-spinner has-seconds">
						<div class="el-time-spinner__wrapper el-scrollbar">
							<div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -8px; margin-right: -9px;">
								<ul class="el-scrollbar__view el-time-spinner__list year">
									
								</ul>
							</div>
						</div>
						<div class="el-time-spinner__wrapper el-scrollbar">
							<div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -8px; margin-right: -9px;">
								<ul class="el-scrollbar__view el-time-spinner__list month">
									
								</ul>
							</div>
						</div>
						<div class="el-time-spinner__wrapper el-scrollbar">
							<div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -8px; margin-right: -9px;">
								<ul class="el-scrollbar__view el-time-spinner__list day">
									
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="el-time-panel__footer">
					<button type="button" class="el-time-panel__btn cancel" @click="cancelTime2($event)">取消</button>
					<button type="button" class="el-time-panel__btn confirm" @click="confirmTime2($event)">确定</button>
				</div>
			</div>
		</div> 
		<el-time-picker :disabled="myDisabled" class="fl no-padding" 
			v-model="dayTime2" 
			:picker-options="{selectableRange: ''}" 
			value-format="HH:mm:ss"
			placeholder="选择时间">
		</el-time-picker>
		<span class="clear"></span>
	</div>
</template>

<script>
	import "../assets/css/index.scss";
	export default {
		name: 'CustomTime',
		props: ['myDisabled'],
		data() {
			return {
				yearTime1: '', //开始yyyy-mm-dd
				yearTime2: '', //结束yyyy-mm-dd
				dayTime1: '', //开始hh-mm-ss
				dayTime2: '', //结束hh-mm-ss
				isShow1: false,//日期弹出框是否显示
				isShow2: false,//日期弹出框是否显示
			};
		},
		mounted() {
			var vm = this;
			vm.getData();
			$(document).bind("click", function(e) {
				var target = $(e.target); //e.target获取触发事件的元素  
				/**以target为起点向上查找父（祖）元素，若父（祖）元素中包含".year-box, .custom"参数中一个就不执行if中语句，即长度不为0  
				 **.closest()沿 DOM 树向上遍历(以数组形式入参)，直到找到已应用选择器的一个匹配为止，返回包含零个或一个元素的 jQuery 对象。  
				 **/
				if(target.closest(".year-box, .custom").length == 0) {
					vm.isShow1 = false;
					vm.isShow2 = false;
				};
				e.stopPropagation();
			})
			　
		},
		methods: {
			getData(){
				var months = 13 ,days = 32;
				var date = new Date;
				var year = date.getFullYear();
				var newYear = year.toString().substr(-2, 2);
				var newYearLen = parseInt(newYear) + 10;
				
				var yearHtml = "<li class='el-time-spinner__item'>00</li>";
				var monthHtml = "<li class='el-time-spinner__item'>00</li>";
				var dayHtml = "<li class='el-time-spinner__item'>00</li>";
				for(var i = newYear; i < newYearLen; i++) {
					var year = i;
					if(i < 10) {
						year = "0" + i;
					}
					yearHtml += "<li class='el-time-spinner__item'>" + year + "</li>";
					$('.year').html(yearHtml);
				}
				
				for(var i = 0; i < months; i++) {
					var month = i;
					if(i < 10) {
						month = "0" + i;
					}
					monthHtml += "<li class='el-time-spinner__item'>" + month + "</li>";
					$('.month').html(monthHtml);
				}
				
				for(var i = 0; i < days; i++) {
					var day = i;
					if(i < 10) {
						day = "0" + i;
					}
					dayHtml += "<li class='el-time-spinner__item'>" + day + "</li>";
					$('.day').html(dayHtml);
				}
				
				$(".year-box ul").each(function() {
					//取出ul下的第一个li
					var li = $(this).children().first();
					li.addClass('active');
				});
				this.addActive();
			},
			showDate1() {
				if (!this.myDisabled) {
					this.isShow1 = true;
					this.isShow2 = false;
				}
			},
			showDate2() {
				if (!this.myDisabled) {
					this.isShow2 = true;
					this.isShow1 = false;
				}
			},
			addActive() {
				$('.year li').click(function(){
					$(this).addClass('active').siblings().removeClass('active');
				});
				$('.month li').click(function(){
					$(this).addClass('active').siblings().removeClass('active');
				});
				$('.day li').click(function(){
					$(this).addClass('active').siblings().removeClass('active');
				});
			},
			confirmTime1(event) {
				var _this = event.target;
				var $_this = $(_this);
				var year = $_this.parents('.year-box').find('.year li.active').html();
				var month = $_this.parents('.year-box').find('.month li.active').html();
				var day = $_this.parents('.year-box').find('.day li.active').html();
				this.yearTime1 = year + "-" + month + "-" + day;
				this.isShow1 = false;
			},
			cancelTime1(event){
				this.isShow1 = false;
			},
			confirmTime2(event) {
				var _this = event.target;
				var $_this = $(_this);
				var year = $_this.parents('.year-box').find('.year li.active').html();
				var month = $_this.parents('.year-box').find('.month li.active').html();
				var day = $_this.parents('.year-box').find('.day li.active').html();
				this.yearTime2 = year + "-" + month + "-" + day;
				this.isShow2 = false;
			},
			cancelTime2(event){
				this.isShow2 = false;
			},
			clearData1(event){
				event.stopPropagation();
				this.yearTime1 = '';
			},
			clearData2(event){
				event.stopPropagation();
				this.yearTime2 = '';
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	@import "src/assets/css/mixin.scss";
	.custom-time {
		width: 600px;
		float: left;
		margin-left: 30px;
		.closeI{
			right:10px;
			font-size:12px;
			top:10px;
		}
		.el-time-spinner.has-seconds .el-time-spinner__wrapper{
			margin-left: 0;
		}
		.text-con {
			@include height(30px);
		}
		.el-date-editor.el-input,
		.el-input {
			width: 130px;
		}
		.custom-year {
			position: relative;
			@include size(130px, 30px);
			margin-right: 10px;
			.year-box {
				position: absolute;
				top: 40px;
				background: #fff;
				z-index: 1;
				@include size(180px, 220px);
				border: 1px solid #dcdfe6;
			}
		}
		.el-scrollbar__wrap{
			overflow: hidden;
			.year, .month, .day{
				overflow-y: auto;
				overflow-x: hidden;
				height: 190px;
				width: 75px;
			}
		}
	}
</style>