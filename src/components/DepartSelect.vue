/**
 * @Author:      qinbb
 * @DateTime:    2018-04-03 18:21:07
 * @Description: 组织机构下拉框
 */
<template>
	<!-- 组织机构下拉框 -->
	<el-select v-model="deptNames" placeholder="请选择" @clear="deptClear" clearable class="aa">
    	<el-option disabled label="请选择" value="0" style="display:none"></el-option> 
    	<el-input placeholder="搜索部门..." class="select-tree-input" v-model="filterText" clearable></el-input> 
	    <el-tree
			ref="deptTree"
			:data="deptList"
			@check-change="deptCheckChange"
			node-key="deptId"
			highlight-current
			show-checkbox
			:check-strictly="true"
			:expand-on-click-node="false"
			:default-expanded-keys="defaultExpandedIds"
			:filter-node-method="filterNode"
			:props="defaultProps">
		</el-tree>
    </el-select>
</template>
<script>
	import { Message } from 'element-ui';
	import store from '../store';  //状态store
	export default {
		name: 'DepartSelect',
		watch: {
	      	filterText(val) {
				this.showTreeNodeId = [];
	        	this.$refs.deptTree.filter(val);
	      	}
	    },
		data() {
			return {
				filterText: '',
				showTreeNodeId: [],
				deptList: [],
				deptId: "",
				deptNames: "",
				timerWait: null, //等待数据的定时器
				defaultExpandedIds: [],

				//自定义树的属性
				defaultProps: {
					children: 'children',
					label: 'deptName'
				}
			};
		},
		mounted() {
			this.initDepart();
		},
		beforeDestroy(){
			if(this.timerWait){
				this.timerWait = clearInterval(this.timerWait); //去掉定时器的方法   同一个变量做定时器
			}
		},
		methods: {
			//获取组织机构树数据
	        initDepart() {
	        	const vm = this;
	        	// if(store.getters.departData.length == 0 ){
	        	// 	store.dispatch('GetDepartData').then(res => { 
			    //         vm.deptList = store.getters.departData;
			    //     }).catch(err => {
			    //         console.log(err);
			    //     });
	        	// }else{
	        	// 	vm.deptList = store.getters.departData;
	        	// }
	      	},
			deptCheckChange(data, checked, indeterminate) {
				var checkedNodes = this.$refs.deptTree.getCheckedNodes();

				if (checkedNodes.length > 1) {
					//设置只选择当前点击的
					this.$refs.deptTree.setCheckedKeys([data.deptId]);
				} else if (checkedNodes.length == 1) {
					this.deptNames = checkedNodes[0].deptName;
					this.deptId = checkedNodes[0].deptId;
					this.$emit('deptIdChange', this.deptId);
				} else {
					if (this.deptId != "") {
						this.deptNames = "";
						this.deptId = "";
						this.$emit('deptIdChange', "");
					}
					
				}
			},
			//清空组织树选中状态
			deptClear() {
				this.$refs.deptTree.setCheckedKeys([]);
				//编辑第一次进入，直接点清除后，setCheckedKeys没有触发change
				this.deptNames = "";
				this.deptId = "";
				this.$emit('deptIdChange', "");
			},
			//设置当前选中
			setCurrentSelect(deptId) {
				var vm = this;
				if (this.deptList.length == 0) {
					this.timerWait = window.setInterval(()=>{
						vm.deptList = store.getters.departData;
						if (vm.deptList.length != 0) {
							vm.timerWait = window.clearInterval(vm.timerWait);
							
							vm.$refs.deptTree.setCheckedKeys([deptId]);
							vm.defaultExpandedIds = [deptId];
							var node = vm.$refs.deptTree.getCheckedNodes();
							vm.deptNames = node[0].deptName;
							vm.deptId = node[0].deptId;
						}
					}, 100);
				} else {
					vm.$refs.deptTree.setCheckedKeys([deptId]);
					var node = vm.$refs.deptTree.getCheckedNodes();
					vm.defaultExpandedIds = [deptId];
					vm.deptNames = node[0].deptName;
					vm.deptId = node[0].deptId;
				}
			},
			//搜索树
          	filterNode(value, data) {
				if (!value) return true;
                var parentShow = this.showTreeNodeId.indexOf(data.deptId) !== -1;
				var show = data.deptName.indexOf(value) !== -1;
				if (show || parentShow) {
					this.showTreeNodeId.push(data.deptId);
					//将子集的ID都放到showTreeNodeId数组里面
					if(data.children){
						for(let index of data.children){
							this.showTreeNodeId.push(index.deptId);
						}
					}
                }
				return parentShow || show;
		    },
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
	
	.dept-tree-list {
		max-height: 300px;
		min-height: 300px;
		overflow-y: auto;
	}

	.select-tree-input {
		.el-input__validateIcon {
			display: none;
		}
	}
</style>