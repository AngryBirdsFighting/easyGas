/**
 * @Author:      qinbb
 * @DateTime:    2018-03-23 14:38:57
 * @Description: 组织机构树
 */
<template>
	<!-- 组织机构树弹框 -->
	<el-dialog title="选择查看车辆" 
		:visible.sync="departData.dialog" 
		:show-close="importClose" 
		@open="dialogOpen" 
		top="10%" width="450px" lock-scroll
		:close-on-click-modal="false"
		:close-on-press-escape="false">
		<!-- 组织机构树 -->
		<div>
			<el-input placeholder="搜索车辆..." class="select-tree-input" v-model="filterText"></el-input>
			<div class="dept-tree-list" ref="elTree">
				<el-tree 
					:data="treeData" 
					:props="defaultProps" 
					show-checkbox 
					node-key="id" 
					default-expand-all
					:check-strictly="!departData.checkBox"
					:expand-on-click-node="false" 
					:render-content="renderContent" 
					:filter-node-method="filterNode" 
					@check="changes" 
					ref="tree">
				</el-tree>
			</div>
		</div>

		<el-button type="primary" icon="el-icon-close" class="btnColor closeBtn" @click.native.prevent="canelMethod"></el-button>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native.prevent="canelMethod">取 消</el-button>
			<el-button type="primary" :disabled="disabledBtn" @click.native.prevent="getCheckedNodes" class="btnColor">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import { Message } from 'element-ui';
	import store from '../store';  //状态store
	export default {
		name: 'DepartTree',
		// 声明 props
		props: ['departData'],
		data() {
			return {
				importClose: false, //不显示自带的关闭按钮
				disabledBtn: true, //确定不可点击
				filterText: '', //搜索框
				treeData: [], //树数据
				nodes: '', //选中的子节点所有数据
				//自定义树的属性
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				showTreeNodeId: [], //记录搜索条件下显示的节点，用来显示自己的子节点
			};
		},
		//监听搜索框
		watch: {
			filterText(val) {
				this.showTreeNodeId = [];
				this.$refs.tree.filter(val);
			}
		},
		mounted() {
			this.initDepart();
		},
		methods: {
			//获取组织机构树
			initDepart() {
				let vm = this;
				if(store.getters.departTree.length == 0 ){
	        		store.dispatch('GetDepartTree').then(res => { 
			            vm.treeData = store.getters.departTree;
						vm.initDisable(vm.treeData); //递归函数 遍历树
			        }).catch(err => {
			            console.log(err);
			        });
	        	}else{
					var time = new Date().getTime() - store.getters.departTreeData;
					//时间大于100秒，重新获取树数据
					if (time > 100 * 1000) {
						store.dispatch('GetDepartTree').then(res => {
							vm.treeData = store.getters.departTree;
							vm.initDisable(vm.treeData); //递归函数 遍历树
						}).catch(err => {
							console.log(err);
						});
					} else {
						vm.treeData = store.getters.departTree;
	        			vm.initDisable(vm.treeData); //递归函数 遍历树
					}
	        	}
			},
			//将树的选中状态和外面业务分离，每次讲需要选择的节点传进来
			dialogOpen() {
				if(this.$refs.tree) {
					this.$refs.tree.setCheckedKeys(this.departData.currentKeys);
					if(this.departData.currentKeys && this.departData.currentKeys == "" ){
						this.disabledBtn = true;
					}
				}
			},
			//初始话只有最后的子级才可以被选disabled为false  其他为true 
			initDisable(data) {
				let vm = this;
				if(!data) {
					return;
				} else if(data.length == 0) {
					return;
				}

				//只能选择车辆
				if(!this.departData.checkBox){
					$.each(data, function(idx, obj) {
						//不是车辆，没有选择功能
						if(obj.type != 1) {
							obj["disabled"] = true;
						}

						vm.initDisable(obj.children);
					});
				}else{//再次点击 修改复选框的状态  均为可选
					$.each(data, function(idx, obj) {
						obj["disabled"] = false;
						vm.initDisable(obj.children);
					});
				}
				
			},
			//修改父组件的值
			canelMethod() {
				this.$emit('closeDialog', false);
			},
			//确认
			getCheckedNodes() {
				this.nodes= this.$refs.tree.getCheckedNodes();
				let node;
				if(!this.departData.checkBox){
					node = this.nodes[0];
				}else{
					/*let carIdArr = [];
					//树多选
					$.each(this.nodes, function(idx, obj) {
						//只统计车辆
						if(obj.type == 1) {
							carIdArr.push(obj.carId);
						}
					});
					node = carIdArr.join(",");*/
					node = this.nodes;
				}
				this.$emit('getCarIds', node);
			},
			//改变树  添加车辆的状态
			renderContent(h, {node,data,store}) {
				if(data.type == 1) {
					//0：离线 1：在线 2：怠速 3：告警 4：未激活
					var classStr = 'car-img caronline'
					switch(data.status) {
						
						case 0:
							{
								classStr = 'car-img caroutline';
							}
							break;
						case 1:
						{
								classStr = 'car-img caronline';
							}
							break;
						case 2:
							{
								classStr = 'car-img carstop';
							}
							break;
						case 3:
							{
								classStr = 'car-img cartip';
							}
							break;
						case 4:
							{
								classStr = 'car-img carnoactive';
							}
							break;
						default:
							break;
					}
					return(
						<span class="custom-tree-node">
			            	<span class={classStr}></span>
			                <span class="strongTree1" title={data.name}>{data.name}</span>
			            </span>
					);
				} else {
					return(
						<span class="custom-tree-node">
			              <span class="strongTree1" title={data.name}>{data.name}</span>
			            </span>
					);
				}

			},
			//搜索树
			filterNode(value, data) {
				if(!value) return true;
				var parentShow = this.showTreeNodeId.indexOf(data.id) !== -1
				var show = data.name.indexOf(value) !== -1;
				if(parentShow || show) {
					this.showTreeNodeId.push(data.id);
				}
				return parentShow || show;
			},
			//选择改变
			changes(data, status) {
				if(status.checkedNodes.length == 0) {
					this.disabledBtn = true; //确定按钮可点击
					return;
				}
				//设置只选择当前点击的
				var checkKeys = [];
				//树单选
				if(!this.departData.checkBox){
					checkKeys.push(data.id);
				}else{
					//树多选
					$.each(status.checkedNodes, function(idx, obj) {
						//只统计车辆
						if(obj.type == 1) {
							checkKeys.push(obj.carId);
						}
					});
				}
				if(checkKeys.length>11){
					this.disabledBtn = true; //确定按钮可点击
					Message.warning({ message: "最多选择11辆车" });
				}else{
					this.$refs.tree.setCheckedKeys(checkKeys);
					this.disabledBtn = false; //确定按钮可点击
				}
			}
		}
	};
</script>
<style rel="stylesheet/scss" scope lang="scss">
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

	.strongTree1 {
		max-width: 100%;
	}
	
	.dept-tree-list {
		margin-top: 5px;
		max-height: 300px;
		min-height: 300px;
		overflow-y: auto;
	}
</style>