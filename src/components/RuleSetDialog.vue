/** * @Author: qinbb * @DateTime: 2018-04-02 16:27:58 * @Description: 分配规则组件 */
<template>
	<el-dialog title="分配规则" :visible.sync="rulesData.dialog" :show-close="seateClose" top="10%" width="50%" lock-scroll :close-on-click-modal="false" :close-on-press-escape="false">
		<div v-loading="setLoad" element-loading-text="拼命加载中">
			<div>
				<!-- 搜索条件 -->
				<div class="filter-container">
					<el-form :inline="true" :model="listQuery" class="demo-form-inline">
						<el-form-item label="状态">
							<el-select v-model="listQuery.config" @change="changeBtn">
								<el-option label="已分配" value="1"></el-option>
								<el-option label="未分配" value="-1"></el-option>
								<!-- 围栏分配 或者 超速和疲劳规则有分配中选项 -->
								<el-option v-if="rulesData.type == 2 || (rulesData.type == 1 && ruleIs2or4)" label="分配中" value="0"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="部门">
							<depart_select ref="queryDept" @deptIdChange="deptCurrentChange"></depart_select>
						</el-form-item>
						<el-form-item label="车牌号">
							<el-input v-model="listQuery.carNum" placeholder="请输入车牌号" clearable></el-input>
						</el-form-item>
						<el-form-item>
							<el-button class="filter-item btnColor" type="primary" icon="el-icon-search" @click.native.prevent="initTable(true)">查询</el-button>
						</el-form-item>
					</el-form>
				</div>
				<!-- 表格 -->
				<el-table :data="list" :height="height" @selection-change="handleSelectionChange" fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
					<el-table-column align="center" type="selection"></el-table-column>
					<el-table-column align="center" label="车牌" prop="carNum"></el-table-column>
					<el-table-column align="center" label="组织" prop="deptName"></el-table-column>
					<el-table-column v-if="isMakedConfig" align="center" label="当前规则名称" prop="ruleName"></el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<div class="marginTop10">
				<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>
			</div>
			<div class="formButton">
				<el-button v-if="listQuery.config != 0" class="filter-item btnColor" type="primary" @click.native.prevent="setRules">{{changeBtnName}}</el-button>
				<el-button class="filter-item btnColor" type="primary" @click.native.prevent="closeDialog">关闭</el-button>
			</div>
			<el-button type="primary" icon="el-icon-close" class="btnColor closeBtn" @click.native.prevent="closeDialog"></el-button>
		</div>
	</el-dialog>

</template>

<script>
	import { Message } from 'element-ui';
	import { utils } from 'src/utils';
	import DepartSelect from './DepartSelect';
	import Pagination from './Pagination';

	export default {
		components: {
			'depart_select': DepartSelect,
			'pagination': Pagination
		},
		name: 'RuleSetDialog',
		// 声明 props
		// ruleIs2or4: 是否为2和4规则， 2 4规则有分配中选项
		props: ['rulesData', 'ruleIs2or4'],

		data() {
			return {
				seateClose: false, //不显示自带的关闭按钮
				list: [], //明细
				height: 350, //高度
				isMakedConfig: false,
				//查询条件
				listQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					carNum: '', //车牌号
					deptId: '', //组织机构ID
					config: '-1', //是否分配  1 已分配  -1 未分配  0 分配中
					ruleId: '', //规则ID
					railId: '' //围栏ID  
				},
				total: 0, //总条数
				listLoading: false, //table加载中
				//树控件数据映射关系
				defaultProps: {
					children: 'children',
					label: 'deptName'
				},
				deptNames: '', //组织机构名称
				deptList: [], //组织机构树
				setRulesData: {
					carIds: [], //车辆ID
					ruleId: '', //规则ID 
					type: '', //操作类型 1：绑定 2：取消
				},
				changeBtnName: '确定分配',
				setLoad: false
			};
		},
		mounted() {
			// this.changeBtn();//查询围栏/规则车辆
		},
		computed: {
			changgeDialog() {
				return this.rulesData.dialog;
			}
		},
		watch: {
			changgeDialog(val, oldVal) {
				//只有点击分配规则
				if(this.rulesData.dialog) {
					// this.initDepart();//获取组织机构树数据
					if(this.$refs.queryDept) {
						this.$refs.queryDept.deptClear();
					}
					// this.initTable();//查询围栏/规则车辆
					this.changeBtn();
				}
			}
		},
		methods: {
			//查询围栏/规则车辆
			initTable(isBackHome = false) {
				var vm = this;
				if(isBackHome) {
					if(vm.listQuery.iDisplayStart != 0) {
						this.$refs.page.backFirstPage();
						return;
					}
				}
				vm.listLoading = true;
				let url = "";
				let params = JSON.parse(JSON.stringify(vm.listQuery));
				//1：规则设定 分配规则  2：围栏设置 分配规则
				if(vm.rulesData.type == 1) {
					params.ruleId = vm.rulesData.ruleId; //规则ID
					delete params.railId;
					url = "/proxy/bizmgr/rule/findRuleCfgCars";
				} else if(vm.rulesData.type == 2) {
					params.railId = vm.rulesData.railId; //围栏ID
					delete params.ruleId;
					url = "/proxy/bizmgr/rail/findRailCfgCars";
				}
				vm.$instance.post(url, params).then(res => {
					vm.listLoading = false;
					if(res.status == 200) {
						vm.list = [];
						vm.total = res.data.contTotal;
						vm.list = res.data.data;
					} else {
						vm.addMarker();
						Message.error({
							message: "调用接口失败"
						});
					}
				}).catch(error => {});

			},
			//状态改变
			changeBtn() {
				if(this.listQuery.config == '1') {
					if(this.rulesData.type == 1) {
						this.isMakedConfig = true;
					}

					this.changeBtnName = '取消分配';
					this.setRulesData.type = 2; //1：绑定 2：取消
				} else if(this.listQuery.config == '-1') {
					if(this.rulesData.type == 1) {
						this.isMakedConfig = false;
					}
					this.changeBtnName = '确定分配';
					this.setRulesData.type = 1; //1：绑定 2：取消
				} else {
					if(this.rulesData.type == 1) {
						this.isMakedConfig = true;
					}
				}
				this.initTable(true);
			},
			/*
			 * 分页改变，加载数据
			 */
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.initTable();
			},
			//
			deptCurrentChange(deptId) {
				this.listQuery.deptId = deptId;
			},
			//清空组织树选中状态
			deptClear(param) {
				this.$refs[param].setCurrentKey();
				this.listQuery.deptId = "";
			},
			//table复选框选中
			handleSelectionChange(val) {
				this.setRulesData.carIds = [];
				if(val) {
					for(let index of val) {
						this.setRulesData.carIds.push(index.carId);
					}
				}

			},
			//确定/取消分配
			setRules() {
				let vm = this;
				vm.setLoad = true;
				let url = '';
				let msg = "";
				if(this.changeBtnName == "确定分配") {
					msg = "分配成功";
				} else if(this.changeBtnName == "取消分配") {
					msg = "取消分配成功";
				}
				//车辆为空  不可分配
				if(this.setRulesData.carIds.length == 0) {
					Message.warning({
						message: "请选择车辆"
					});
					return;
				}
				let params = JSON.parse(JSON.stringify(vm.setRulesData));
				if(vm.rulesData.type == 1) {
					params.ruleId = vm.rulesData.ruleId; //规则ID
					delete params.railId;
					url = "/proxy/bizmgr/rule/ruleConfig";
				} else if(vm.rulesData.type == 2) {
					params.railId = vm.rulesData.railId; //围栏ID
					delete params.ruleId;
					url = "/proxy/bizmgr/rail/railConfig";
				}
				vm.$instance.post(url, params).then(res => {
					vm.setLoad = false;
					if(res.status == 200) {
						vm.closeDialog(); //关闭 并清空 刷新
						Message({
							showClose: true,
							message: msg,
							type: 'success',
							duration: 1000
						});
					} else {
						Message.error({
							message: "调用接口失败"
						});
					}
				}).catch(error => {});
			},
			//关闭 并清空 弹框
			closeDialog() {
				this.$emit('changeRule', false); //修改父组件的值
				this.listQuery.config = '-1';
				this.setRulesData.carIds = [];
				// this.initTable();
				// this.changeBtn();
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss">
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
		height: 360px;
		border: 1px solid gray;
		overflow: hidden;
	}
	
	.marginTop10 {
		margin-top: 10px;
		margin-bottom: 5px;
	}
</style>