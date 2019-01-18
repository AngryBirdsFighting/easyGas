/*
 * @Author: Wang Chao 
 * @Date: 2019-01-16 13:50:55 
 * @Last Modified by: Wang Chao
 * @Last Modified time: 2019-01-18 09:40:11
 * @Description:  缴费管理
 */

<template>
	<div class="app-container">
		
		<!-- 搜索条件 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<!-- <el-form-item label="条形码">
					<el-input v-model="listQuery.carNum" placeholder="请输入车牌号" clearable></el-input>
				</el-form-item> -->
				<el-form-item label="住户姓名">
					<el-input v-model="listQuery.name" placeholder="请输入用户名" clearable></el-input>
				</el-form-item>
				<el-form-item label="身份证号">
					<el-input v-model="listQuery.idNumber" placeholder="请输入电话" clearable></el-input>
				</el-form-item>
				<el-form-item label="住户编码">
					<el-input v-model="listQuery.householdCode" placeholder="请输入住户编码" clearable></el-input>
				</el-form-item>
				<!-- <el-form-item label="小区">
					<el-select v-model="listQuery.powerType" clearable placeholder="请选择燃油类型">
						<el-option label="请选择" value=""></el-option>
						<el-option
						v-for="item in dictionaries.fuel_type"
						:key="item.dictCode"
						:label="item.dictName"
						:value="item.dictCode">
						</el-option>
					</el-select>					 
				</el-form-item> -->
				
				<el-form-item>
					<el-button class="filter-item btnColor" type="primary" icon="el-icon-search" @click="(getList(true))">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-if="permBtn.car_add" class="filter-item btnColor" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-if="permBtn.car_export" class="filter-item" type="primary" icon="el-icon-download" @click="exportFormLists">导出</el-button>
				</el-form-item>
				<!--导入按钮以及弹框  start-->
				<!-- <el-form-item>
					<el-button class="filter-item" type="primary" icon="el-icon-upload2" @click="importForm">导入</el-button> 
					<import :importVisible="importVisible" @changeImport="changeImports($event)"></import> 
				</el-form-item> -->
				<!-- <br/> -->
				
				<!--导入按钮以及弹框  end-->
			</el-form>
		</div>
		
		<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height"  fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label='住户名' prop="name" width="130"></el-table-column>
			<el-table-column align="center" label="住户编号" prop="householdCode"></el-table-column>
			<el-table-column align="center" label="电话" prop="phone" width="100"></el-table-column></el-table-column>
		    <el-table-column align="center" label="小区" prop="villageName"></el-table-column>
			<el-table-column align="center" label="身份证号" prop="idNumber"></el-table-column>
			<el-table-column align="center" label="条形码" prop="barCode">--</el-table-column>
			<el-table-column align="center" label="表类型" >
				<template slot-scope="scope">
					<div v-if="!scope.row.gasMeterType">--</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="150">
				<template slot-scope="scope">
					<el-button  class="btn check" size="small" @click="check(scope.$index, scope.row)" title="查看"></el-button>
					<el-button  class="btn update" size="small" @click="handleEdit(scope.$index, scope.row)" title="修改"></el-button>
					<el-button  class="btn delete" size="small" @click="handleDelete(scope.$index, scope.row)" title="删除"></el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<!--新增弹框-->
		<el-dialog title="新增车辆" :visible.sync="addFormVisible" top="10%" width="650px" lock-scroll class="dialog_input"
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="addDialogForm"  :rules="rulesAdd" :model="addCar" label-position="left" label-width="120px"
					v-loading="addLoad" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="12">
						<div class="grid-content bg-purple">
							<el-form-item label="车辆品牌：" prop="carBrand">
								<el-select v-model="addCar.carBrand" filterable clearable @change="currentCarBrandChange_add" placeholder="请选择车辆品牌">
								
									<el-option
									v-for="item in dictionaries.car_brands"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>	
							</el-form-item>						
							<el-form-item label="车辆颜色：" prop="carColor">
								<el-select v-model="addCar.carColor" clearable placeholder="请选择车辆颜色">
								
									<el-option
									v-for="item in dictionaries.car_color"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>	
							</el-form-item>
						    <el-form-item label="车辆用途：" prop="useType">
								<el-select v-model="addCar.useType" clearable placeholder="请选择车辆用途">
								
									<el-option
									v-for="item in dictionaries.car_use"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>
						    </el-form-item>
							<el-form-item label="组织机构：" prop="deptId">
								<depart_select ref="addDepartSelect" @deptIdChange="addDeptCurrentChange"></depart_select>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
				        <el-form-item label="车辆型号：" prop="carModel">
							<el-select v-model="addCar.carModel" filterable clearable placeholder="请选择车辆型号">
									<el-option
									v-for="item in car_model"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>
					    </el-form-item>							
						<el-form-item label="车牌号：" prop="carNum">
							<el-input v-model="addCar.carNum" :maxlength="9" placeholder="车牌号" clearable></el-input>
						</el-form-item>
                        <el-form-item label="车牌颜色：" prop="carPlateColor">
							<el-select v-model="addCar.carPlateColor" clearable placeholder="请选择车牌颜色">
								
									<el-option
									v-for="item in dictionaries.car_plate_color"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>
						</el-form-item>
						<el-form-item label="燃油类型" prop="powerType">
								 <el-select v-model="addCar.powerType" clearable placeholder="请选择燃油类型">
									 <el-option
									 v-for="item in dictionaries.fuel_type"
									 :value="item.dictCode"
									 :label="item.dictName"
									 :key="item.dictCode">
									 </el-option>
						        </el-select>					 
				        </el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="addFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleCreateSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		
		<!--编辑-->
		<el-dialog title="编辑车辆" :visible.sync="updateFormVisible" width="650px" top="10%" lock-scroll  class="dialog_input"
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="editDialogForm" :rules="rulesEdit" :model="editCar" label-position="left" label-width="120px"
					v-loading="updateLoad" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="12">
						<div class="grid-content bg-purple">
							<el-form-item label="车辆品牌：" prop="carBrand">
								<el-select v-model="editCar.carBrand" filterable clearable @change="currentCarBrandChange_edit" placeholder="请选择车辆品牌">
									<el-option
									v-for="item in dictionaries.car_brands"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>	
							</el-form-item>						
							<el-form-item label="车辆颜色：" prop="carColor">
								<el-select v-model="editCar.carColor" clearable placeholder="请选择车辆颜色">
									
									<el-option
									v-for="item in dictionaries.car_color"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>	
							</el-form-item>
						    <el-form-item label="车辆用途：" prop="useType">
								<el-select v-model="editCar.useType" clearable placeholder="请选择车辆用途">
									<el-option
									v-for="item in dictionaries.car_use"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>
						    </el-form-item>
							<el-form-item label="组织机构：" prop="deptId">
								<depart_select ref="editDepartSelect" @deptIdChange="editDeptCurrentChange"></depart_select>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
				        <el-form-item label="车辆型号：" prop="carModel">
							<el-select v-model="editCar.carModel" filterable clearable placeholder="请选择车辆型号">
									<el-option
									v-for="item in car_model"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>
					    </el-form-item>							
						<el-form-item label="车牌号：" prop="carNum">
							<el-input v-model="editCar.carNum" :maxlength="9" placeholder="车牌号" clearable></el-input>
						</el-form-item>
                        <el-form-item label="车牌颜色：" prop="carPlateColor">
							<el-select v-model="editCar.carPlateColor" clearable placeholder="请选择车牌颜色">
								
									<el-option
									v-for="item in dictionaries.car_plate_color"
									:value="item.dictCode"
									:label="item.dictName"
									:key="item.dictCode">
									</el-option>
								</el-select>
						</el-form-item>
						<el-form-item label="燃油类型" prop="powerType">
								 <el-select v-model="editCar.powerType" clearable placeholder="请选择燃油类型">
									 <el-option
									 v-for="item in dictionaries.fuel_type"
									 :value="item.dictCode"
									 :label="item.dictName"
									 :key="item.dictCode">
									 </el-option>
						        </el-select>					 
				        </el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="updateFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handleEditSubmit('editDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!--查看-->
		<el-dialog title="查看车辆" :visible.sync="checkFormVisible" top="10%" width="650px" lock-scroll  :close-on-click-modal="false">
			<el-form class="small-space" v-if="carInfo" label-position="left" label-width="120px">
				<el-row>
					<el-col :span="12">
						<div class="grid-content bg-purple">
							<el-form-item label="车辆品牌：">
								<strong>{{carInfo.carBrandName}}</strong>
							</el-form-item>
							<el-form-item label="车辆颜色：">
								<strong>{{carInfo.carColorName}}</strong>
							</el-form-item>
							<el-form-item label="车辆用途：">
								<strong>{{carInfo.useTypeName}}</strong>
							</el-form-item>	
							<el-form-item label="组织机构：">
							    <strong class="strongTipWrapNoScoll">{{carInfo.deptName}}</strong>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
						<el-form-item label="车辆型号：">
								<strong>{{carInfo.carModelName}}</strong>
							</el-form-item>
							<el-form-item label="车牌号：">
								<strong>{{carInfo.carNum}}</strong>
							</el-form-item>
							<el-form-item label="车牌颜色：">
								<strong>{{carInfo.carPlateColorName}}</strong>
							</el-form-item>		
							<el-form-item label="燃油类别：">
								<strong>{{carInfo.powerTypeName}}</strong>
							</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
		
		<!--驾驶员绑定弹窗-->
		<el-dialog title="驾驶员绑定" :close-on-click-modal="false"
			:close-on-press-escape="false" :visible.sync="driverFormVisible" width="730px" height="450px" top="10%" lock-scroll class="boxres">
			<div v-loading="driverLoad" element-loading-text="拼命加载中">
				<div>
					<el-form :inline="true" :model="driverListQuery" class="demo-form-inline">
						<el-form-item label="姓名：">
							<el-input v-model="driverListQuery.driverName" size="227px" placeholder="请输入姓名"></el-input>
						</el-form-item>
						<!-- <el-form-item  style="text-align:center;" label="部门：">
							<depart_select @deptIdChange="bindDeptCurrentChange"></depart_select>@current-change="handleRowChange"
						</el-form-item> -->
						<el-form-item>
							<el-button class="filter-item btnColor" type="primary" icon="el-icon-search" @click="getDriverData(true)">查询</el-button>
						</el-form-item>
					</el-form>
					
				</div>
				<div style="width:100%; height:250px; margin:0 auto;">
					<el-table class="driver-table" ref="driverTable" height="250"   v-if="driverData"  :data="driverData" style = "width:100%"  highlight-current-row 
							v-loading="driverTableLoad" element-loading-text="拼命加载中">
						 <el-table-column label='选择' width='40' align="center">
							<template slot-scope='scope'>
							<!--
							&nbsp; 为空，不加这个radio的label会显示index数字，注意从0开始的；radio会全选的问题是label相同导致的
							-->
							<el-radio class="radio"  :label='scope.$index' v-model="radio" @change.native="handleRowChange(scope.$index, scope.row)">&nbsp;</el-radio>
							</template>
						</el-table-column>
						<el-table-column align="center" label='姓名' prop="driverName"></el-table-column>
						<el-table-column align="center" label="部门" prop="deptName"></el-table-column>
						<el-table-column align="center" label="联系电话" prop="phone"></el-table-column>
						<el-table-column align="center" label="驾照等级" prop="licenceType"></el-table-column>
						<el-table-column align="center" label="驾龄" prop="drivingAge"></el-table-column>
			    	</el-table>
				</div>
				<!-- 分页 -->
				<pagination ref="pageDriver" :total="driverTotal" @reLoadData="driverPaginationChange"></pagination>
			    <div class="formButton">
					<el-button @click="closeDriverTable">取 消</el-button>
					<el-button type="primary" @click.native.prevent="bindDriverSubmit()" class="btnColor">保 存</el-button>
				</div>
			</div>
		</el-dialog>
			
		<!--设备绑定弹窗-->
		<el-dialog title="设备绑定" :close-on-click-modal="false"
			:close-on-press-escape="false"  :visible.sync="equImeiFormVisible" top="10%" width="488px"  height="280px" lock-scroll class="boxres equimei-dialog">
			<el-form class="small-space" :rules="driverEquImeiRule" v-if="equImeiData"  ref="bindEquImeiForm"  label-position="left" label-width="140px"
					v-loading="imeiLoad" element-loading-text="拼命加载中">
				<el-form-item label="车牌号：" prop="carNum">
				    <el-input disabled  v-model="bindEquImeiForm.carNum" placeholder="车牌号"></el-input>
			   </el-form-item>
                <el-form-item label="设备关联手机号：" prop="equId">
					<el-select v-model="bindEquImeiForm.equId" clearable filterable placeholder="请选择手机号">
						<el-option
						v-for="item in equImeiData"
						:value="item.equId"
						:label="item.phone"
						:key="item.phone">
						</el-option>
					</el-select>
				</el-form-item>
				<p class="equimei-text">注：车牌号.设备号对应一致，系统才能绑定成功！</p>
				<el-form-item class="formButton">
					<el-button @click="equImeiFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="bindEquImeiSubmit()" class="btnColor">保 存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		
		<!--驾驶员解绑弹窗-->
		<el-dialog title="驾驶员解绑" :close-on-click-modal="false"
			:close-on-press-escape="false" :visible.sync="UnbindDriverVisible" top="10%" width="488px"  height="280px" lock-scroll class="boxres equimei-dialog">
			<div class="confirm" v-loading="driverUnLoad" element-loading-text="拼命加载中">
				<div class="confirm-top">
					<i class="icon-c-zhuyi"></i>
					<span class="confirm-text">
						 您确定要解绑吗？
					</span>
				</div>
				<div class="confirm-bottom">
					<span class="delete-text-l">车牌：{{UnBindDriverData.carNum}}</span>
					<span class="delete-text-r">驾驶员：{{UnBindDriverData.driverName}}</span>
				</div>
				<div class="formButton">
					<el-button @click="UnbindDriverVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="UnbindDriverSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</div>
			</div>
		</el-dialog>
		
		<!--设备解绑弹窗-->
		<el-dialog title="设备解绑" :close-on-click-modal="false"
			:close-on-press-escape="false" :visible.sync="UnbindEquImeiVisible"  top="10%" width="488px" lock-scroll class="boxres equimei-dialog">
			<div class="confirm" v-loading="imeiUnLoad" element-loading-text="拼命加载中">
				<div class="confirm-top">
					<i class="icon-c-zhuyi"></i>
					<span class="confirm-text">
						 您确定要解绑吗？
					</span>
				</div>
				<div class="confirm-bottom">
					<span class="delete-text-l">车牌：{{UnBindEquImeiData.carNum}}</span>
					<span class="delete-text-r">设备：{{UnBindEquImeiData.equImei}}</span>
				</div>
				<div class="formButton">				
					<el-button @click="UnbindEquImeiVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="UnbindEquImeiSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</div>
			</div>
		</el-dialog>
		
	</div>
</template>

<script>
	import "../../assets/css/index.scss";
	import { Message } from 'element-ui';
	import { validate } from 'utils/validate';
	import { utils } from 'src/utils';
	import Import from '../../components/Import'; //导入弹框组件
	import DepartSelect from '../../components/DepartSelect';
	import Pagination from '../../components/Pagination';
import { debug } from 'util';

	export default {
		components: {
			'import': Import,
			'depart_select':DepartSelect,
			 'pagination': Pagination
		 },
		data() {
			const vm =this;
			//部门验证
			const validateDepatTree = (rule, value, callback) => {
				var keys = "";
				if (vm.addFormVisible) { //新增
					keys = vm.addCar.deptId;
				} else {//编辑
					keys = vm.editCar.deptId;
				}
				
				if (keys == "") {
					callback(new Error('请选择部门'));
				} else {
					callback();
				}
			};

			//车牌号唯一性验证
			const validateCardNum = (rule, value, callback) => {
				if (vm.isValidate.isOk) {
					if (vm.isValidate.CardNum) {
						callback();
						return;
					}
				} else {
					vm.isValidate.CardNum = false;
				}				
				if (value === '' || value === null) {
					callback(new Error('车牌号不能为空'));
				} else {
					let param = {};
					param.carNum = value;
					param.flags = true;
					if (vm.updateFormVisible == true) {
						param.carId = vm.editCar.carId;
					}				
					vm.$instance.post("/proxy/bizmgr/car/uniqueCarNum", param).then(res =>{
						if(res.status == 200){
							//唯一
							if (res.data.success) { //新增提交
								callback();
							} else { //不唯一
								callback(new Error("车牌号不唯一，请重新输入"));
							}
						}else{
							Message.error({message:"调用接口失败"});
							callback(new Error("调用接口失败"));
						}
					}).catch(error => {callback(new Error("调用接口失败"));});
				}
			};
			return {
				//按钮的权限 查询query 新增add   true 显示  false 隐藏
				permBtn:{
	                car_add: false,
					car_delete: false, 
					car_Modify: false, 
					car_check: false, 
					car_import: false,
					car_export: false,
					equment_Rule: false,
					driver_Rule: false
				},
				radio:"",
				editDeptDefaultCheck: [], //编辑默认选择部门
				editDeptDefaultOpen: [],//编辑默认打开
				carInfo:null,//车辆详细
				driverData:null,//未绑定驾驶员数据
				equImeiData:null,//未绑定设备数据
				list:[], //表格list
				total: 0,
				driverTotal: 0,
				listLoading: true,
				height: 540,
				deptList: [], //组织机构树数据
				deptNames: "", //部门显示的名称
				//列表查询参数
				listQuery: {
					iDisplayLength: 2,
					iDisplayStart: 0,
					name: "",
					idNumber:"",
					householdCode: ""
				},
				//驾驶员列表查询参数
				driverListQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					driverName: '',
					deptId: '',
					isbind: false
				},
                //唯一性验证状态记录
				isValidate:{
					account: false,
					phone: false,
					isOk: false   //点击确定第一时间将此变量设置为true
				},
				
				//树控件数据映射关系
        		defaultProps: {
          			children: 'children',
          			label: 'deptName'
				},	
				//导入模板的参数
				importVisible:{
					imports: false,//弹框是否显示
					templateName: 'biz_vehicle',//下载模板的名称
				},
				//数据字典
                dictionaries:{
					car_color: [],
					fuel_type: [],
					car_plate_color: [],
					car_use: [],
					car_brands: []
				},
				car_model: [], //车辆型号
				//新建数据
				addCar: {
					carBrand: "",
					carColor:"",
					carModel: "",
					carNum: "",
					deptId: "",
					carPlateColor: "",
					powerType: "",
					useType: "",
				},
				//绑定驾驶员数据
				bindDriverData: {
					carId: "",
					driverId: "",
					status: ""
				},
				//绑定设备数据
				bindEquImeiForm: {
					carId: "",
					equId: "",
					status: ""
				},
				//设备解绑数据
				UnBindEquImeiData:{
				   carId:"",
				   equId:"",
				   carNum:"",
				   equImei:""
				},
				//驾驶员解绑数据
				UnBindDriverData:{
					carId:"",
					driverId:"",
					carNum:"",
					driverName:""
				},
				//编辑数据
				editCar: {
					carId: "",
					carBrand: "",
					carColor:"",
					carModel: "",
					carNum: "",
					deptId: "",
					carPlateColor: "",
					powerType: "",
					useType: "",
				},
				//新增编辑数据校验
				rulesAdd: {
					carBrand: [
						{ required: true, message: '请选择车辆品牌', trigger: 'change' }
					],
					carColor: [
						{ required: true, message: '请选择车辆颜色', trigger: 'change' }
					],
					carModel: [
						{ required: false, message: '请选择车辆类型', trigger: 'change'}
					],
					carPlateColor: [
						{ required: true, message: '请选择车牌颜色', trigger: 'change'}
					],
					useType: [
						{ required: true, message: '请选择车辆用途', trigger: 'change'}
					],
					powerType: [
						{ required: true, message: '请选择燃油类型', trigger: 'change'}
					],
					carNum: [
						{ required: true, validator: validateCardNum, trigger: 'blur'},
						{ required: true, message: '请填写车牌号', trigger: 'change'}
					],
					deptId: [
						{ required: true, validator: validateDepatTree }
					]
				},
				rulesEdit: {
					carBrand: [
						{ required: true, message: '请选择车辆品牌', trigger: 'change' }
					],
					carColor: [
						{ required: false, message: '请选择车辆颜色', trigger: 'change' }
					],
					carModel: [
						{ required: true, message: '请选择车型', trigger: 'change'}
					],
					carPlateColor: [
						{ required: true, message: '请选择车牌颜色', trigger: 'change'}
					],
					useType: [
						{ required: true, message: '请选择车辆用途', trigger: 'change'}
					],
					powerType: [
						{ required: true, message: '请选择燃油类型', trigger: 'change'}
					],
					carNum: [
						{ required: true, validator: validateCardNum, trigger: 'blur'}
					],
					deptId: [
						{ required: true, validator: validateDepatTree }
					]
				},
				driverEquImeiRule: {
                    equId: [
						{required: true, message: '选择设备', trigger: 'blur'}
					]
				},
				deptNameCheck: "", //查看需要的部门名称
				roleNamesCheck: "", //查看需要的角色名称
                // 弹窗
				addFormVisible: false,
				updateFormVisible: false,
				checkFormVisible: false,
				roleManFormVisible: false,
				equImeiFormVisible: false,
				driverFormVisible: false,
				UnbindEquImeiVisible: false,
				UnbindDriverVisible: false,

				waitTime: null,
				addLoad: false,//新增加载状态
				updateLoad: false,//修改加载状态
				imeiLoad: false,//imei绑定加载状态
				driverTableLoad: false,//驾驶员table
				driverLoad: false,//驾驶员加载状态
				imeiUnLoad: false,//imei解绑加载状态
				driverUnLoad: false,//驾驶员解绑加载状态
			}
		},
		mounted() {
			var vm = this;
			// vm.getPerm();
			vm.getList();
			vm.getDictionaries();
			this.$nextTick(function(){
				utils.getTableHeight((height)=>{
					this.height = height;
				});
			})
		},
		//实例销毁之间调用。在这一步，实例仍然完全可用。   时间定时器
		beforeDestroy(){
			if(this.waitTime){
				this.waitTime = clearInterval(this.waitTime); //去掉定时器的方法   同一个变量做定时器
			}
		},
		watch: {
			driverFormVisible(curVal, oldVal) {
                if(!oldVal){
					this.bindDriverData.driverId = ''
				}
			},
			equImeiFormVisible(curVal, oldVal) {
                if(oldVal){
					this.bindEquImeiForm.carId = '';
					this.bindEquImeiForm.carNum = '';
					this.bindEquImeiForm.equId = ''
				}
			}
		},
		methods: {
			//获取当前页面的权限
			// getPerm(){
			// 	this.permBtn = utils.permsButton(this);
			// },
			//获取列表数据
			//isBackHome 是否返回首页
			getList(isBackHome = false) {
				var vm = this;
				if (isBackHome) {
					if (vm.listQuery.iDisplayStart != 0) {
						vm.$refs.page.backFirstPage();
						return;
					}
				}
				vm.listLoading = true;
				//调用接口
				let param = JSON.parse(JSON.stringify(vm.listQuery));
		        vm.$instance.post("/proxy/household/queryList", param).then(res =>{	
					vm.listLoading = false;
		          	if(res.status == 200){
						  
		                vm.list = res.data.data;
						vm.total = res.data.contTotal;
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},
			//获取字典
			getDictionaries() {
				var vm = this;
				let arr = ["fuel_type","car_plate_color","car_use","car_brands","car_color"];
				utils.batchDictsByCode(arr, data => {
					vm.dictionaries = data;
				})
			},
			currentCarBrandChange_add(val) {
				this.getCarType(val, "add");
			},
			currentCarBrandChange_edit(val) {
				this.getCarType(val, "edit");
			},
			//根据所选车辆品牌，加载车辆型号
			getCarType(val, type) {
				this.car_model = [];
				if (type == "add") {
						this.addCar.carModel = "";
						this.editCar.carModel = "";
					} else {
						this.addCar.carModel = "";
						this.editCar.carModel = "";
					}
				// if (!val || val == "") {
				// 	this.car_model = [];
				// 	if (type == "add") {
				// 		this.addCar.carModel = "";
				// 	} else {
				// 		this.editCar.carModel = "";
				// 	}
				// 	return;
				// }
				var vm = this;
				utils.dictsByCode(val, data => {
					vm.car_model = data;
				});
			},
			//获取未绑定驾驶员
			getDriverData(isBackHome = false) {
				var vm = this;
				if (isBackHome) {
					if (vm.driverListQuery.iDisplayStart != 0) {
						this.$refs.pageDriver.backFirstPage();
						return;
					}
				}	
				vm.driverTableLoad = true;		
				//调用驾驶员列表接口
				let param = JSON.parse(JSON.stringify(vm.driverListQuery));
				vm.$instance.post("/proxy/bizmgr/driver/findDriverList", param).then(res =>{
					vm.driverTableLoad = false;		
					if(res.status == 200){
						vm.driverData = res.data.data;
						vm.driverTotal = res.data.contTotal;
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					
				});
			},
			//获取未绑定驾设备
			getEquImeiData(deptId) {
				var vm = this;
				let param = {
				    deptId: deptId
				};
				vm.$instance.get("/proxy/bizmgr/equ/findUnboundEqus",{params: param}).then(res =>{
					if(res.status == 200){
						vm.equImeiData = res.data;
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					
				});
			},
			//根据Id获取数据
			getCarData(carId, type) {
				let vm = this;
				let param = {};
				param.carId = carId;
				//调用接口
				vm.$instance.get("/proxy/bizmgr/car/findCarInfo", {params: param}).then(res =>{
					if(res.status == 200){
						vm.carInfo = res.data;
						if(type == "edit"){
							vm.currentCarBrandChange_edit(vm.carInfo.carBrand);
							for (var i in this.editCar){
								vm.editCar[i] = vm.editCar[i] || vm.carInfo[i];
							}
							if (vm.$refs.editDepartSelect) {
								vm.$refs.editDepartSelect.setCurrentSelect(vm.editCar.deptId);
							} else {
								vm.waitTime = window.setInterval(()=>{
									if (vm.$refs.editDepartSelect) {
										vm.waitTime = window.clearInterval(vm.waitTime);
										vm.$refs.editDepartSelect.setCurrentSelect(vm.editCar.deptId);
									}
								}, 100);
							}
						}							
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					vm.checkFormVisible = false; 
					vm.updateFormVisible = false; 
					Message.error({
						message:"数据获取失败！"
					});
				});
			},
			/**
			 * 分页改变，加载数据
			 */
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},
			/**
			 * 分页改变，加载数据--驾驶员绑定
			 */
			driverPaginationChange(pageData) {
				this.driverListQuery.iDisplayStart = pageData.iDisplayStart;
				this.driverListQuery.iDisplayLength = pageData.iDisplayLength;
				this.getDriverData();
			},		
			deptCurrentChange(deptId) {
				this.listQuery.deptId = deptId;
			},
			
			//打开新增弹窗
			handleCreate() {
				let obj = this.addCar;
				for (const item in obj) {
					if (obj.hasOwnProperty(item)) {
						obj[item] = ""						
					}
				}				
				this.isValidate.account = false;
				this.isValidate.phone = false;
				this.isValidate.isOk = false;
				this.addFormVisible = true;
				this.car_model = [];
				if (this.$refs.addDepartSelect) {
					this.$refs.addDepartSelect.deptClear();
				}
				this.resetForm("addDialogForm");
			},
			//新增确定
			handleCreateSubmit(formName) {								
				this.isValidate.isOk = true;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.createSubmit();
					}
					this.isValidate.isOk = false;
				});
			},		
			//新增车辆提交
			createSubmit() {
				var vm = this;
				vm.addLoad = true;
				let param = JSON.parse(JSON.stringify(vm.addCar));
				vm.$instance.post("/proxy/bizmgr/car/addCar", param).then(res =>{
					vm.addLoad = false;
					if(res.status == 200){
						if (res.data.success) {
							vm.addFormVisible = false;
							Message({
					          showClose: true,
					          message: '新增成功',
					          type: 'success',
					          duration: 1000 ,
					          onClose: function(){
					          	vm.getList(true);
					          }
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					vm.addLoad = false;
				});	
			},
			//点击选中行选择驾驶员
			handleRowChange(val,row) {
				if(row.driverId){
                    this.bindDriverData.driverId = row.driverId;
				}			
			},
			// 关闭驾驶员列表
			closeDriverTable(){
				this.$refs.driverTable.setCurrentRow();
				this.driverFormVisible = false;
			},
			//查看
			check(index, row) {
				this.carInfo = null;
				this.getCarData(row.carId);
				this.checkFormVisible = true;
			},
			//删除
			handleDelete(index, row) {
				if(row.driverName != null || row.equImei != null){
					this.$message({
			          	message: '此车辆被绑定，不能删除，请解绑后进行删除！',
			          	type: 'warning',
			          	duration: '1500'
			        });
		    		return;
				}
				var vm = this;
				let param = {};
				param.carId = row.carId;
				//确定删除
				this.$confirm('是否删除< '+ row.carNum +' >车辆！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//调用接口
					vm.$instance.post("/proxy/bizmgr/car/deleteCar", param).then(res =>{
						if(res.status == 200){
							if (res.data.success) {
								Message.success({message: '删除成功！'});
								vm.$refs.page.deleteItemReLoadList();
							} else {
								Message.error({message:res.data.errorMsg});
							}
						}else{
							Message.error({message:"调用接口失败"});
						}
					}).catch(error => {});
				}).catch(() => {
					Message.info({message: '已取消删除'});          
				});
			},
			//新增部门选择改变
			addDeptCurrentChange(deptId){
				this.addCar.deptId = deptId;
				this.$refs.addDialogForm.validateField("deptId");
			},
			//新增编辑部门选择改变
			editDeptCurrentChange(deptId){
				this.editCar.deptId = deptId;
				this.$refs.editDialogForm.validateField("deptId");
			},
			//修改获取信息
			handleEdit(index, row) {
			    for (var i in this.editCar){
					this.editCar[i] = ""
				};
				// if(row.driverName != null || row.equImei != null){
				// 	this.$message({
			    //       	message: '此车辆被绑定，不能修改，请解绑后进行修改！',
			    //       	type: 'warning',
			    //       	duration: '1500'
			    //     });
		    	// 	return;
				// }
				this.isValidate.account = false;
				this.isValidate.phone = false;
				this.isValidate.isOk = false;
				let obj = this.editCar;
				for (const item in obj) {
					if (obj.hasOwnProperty(item)) {
						obj[item] = ""						
					}
				}
				this.car_model = [];
				this.editCar.carId = row.carId;
				this.getCarData(row.carId, 'edit')		
				this.updateFormVisible = true;
			},
			//修改确定
		    handleEditSubmit(formName) {
				this.isValidate.isOk = true;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.editSubmit();
					}
					vm.isValidate.isOk = false;
				});
			},
			//修改提交
		    editSubmit() {
				var vm = this;
				vm.updateLoad = true;
				let param = JSON.parse(JSON.stringify(vm.editCar));
				vm.$instance.post("/proxy/bizmgr/car/modifyCar", param).then(res =>{
					vm.updateLoad = false;
					if(res.status == 200){
						if (res.data.success) {
							vm.updateFormVisible = false;
							Message({
					          showClose: true,
					          message: '修改成功',
					          type: 'success',
					          duration: 1000 ,
					          onClose: function(){	
								vm.getList();
					          }
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					vm.updateLoad = false;
				});
			},
			//设备绑定弹窗
			openBindEquImei(index, row, Type) {
				this.radio = ""
				this.equImeiFormVisible = true;
				this.getEquImeiData(row.deptId);
				this.bindEquImeiForm.carId = row.carId;
				this.bindEquImeiForm.carNum = row.carNum;
			},
			//驾驶员绑定弹窗
			openBindDriver(index, row) {
				this.driverFormVisible = true;
				this.driverListQuery.deptId = row.deptId
				this.getDriverData();
				this.bindDriverData.carId = row.carId;
			},
			//打开设备解绑弹窗
			openUnbindEquImei(index, row, Type) {
				var vm = this;
				vm.UnBindEquImeiData.carNum = row.carNum;
				vm.UnBindEquImeiData.equImei = row.equImei;
				vm.UnBindEquImeiData.carId = row.carId;
				vm.UnBindEquImeiData.equId = row.equId;
				vm.UnBindEquImeiData.status = "N";
				vm.UnbindEquImeiVisible = true;			
			},
			//打开驾驶员解绑弹窗
			openUnbindDriver(index, row, Type) {
				var vm = this;
				let param = {};
				vm.UnBindDriverData.carNum = row.carNum;
				vm.UnBindDriverData.driverName= row.driverName;
				vm.UnBindDriverData.carId = row.carId;
				vm.UnBindDriverData.driverId= row.driverId;
				vm.UnBindDriverData.status = "N";
				vm.UnbindDriverVisible = true;
			},
			//设备解绑接口
			UnbindEquImeiSubmit(){
				let vm = this;
				let param = {
					carId:  vm.UnBindEquImeiData.carId,
					equId:  vm.UnBindEquImeiData.equId	,
					status:  vm.UnBindEquImeiData.status,
				}
				vm.imeiUnLoad = true;
                vm.$instance.post("/proxy/bizmgr/car/bindUnbindEqu", param).then(res =>{
                	vm.imeiUnLoad = false;
					if(res.status == 200){
						if (res.data.success) {
							vm.UnbindEquImeiVisible = false;
							Message({
					          showClose: true,
					          message: '解绑成功',
					          type: 'success',
					          duration: 1000 ,
					          onClose: function(){	
								vm.getList();
					          }
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					vm.imeiUnLoad = false;
				});
			},
			//驾驶员解绑接口
			UnbindDriverSubmit(){
				let vm = this;
				let param = {
					carId:  vm.UnBindDriverData.carId,
					driverId:  vm.UnBindDriverData.driverId	,
					status:  vm.UnBindDriverData.status
				}
				vm.driverUnLoad = true;
                vm.$instance.get("/proxy/bizmgr/car/bindUnbindDriver",{params: param}).then(res =>{
                	vm.driverUnLoad = false;
					if(res.status == 200){
						if (res.data.success) {
							vm.UnbindDriverVisible = false;
							Message({
					          showClose: true,
					          message: '解绑成功',
					          type: 'success',
					          duration: 1000 ,
					          onClose: function(){	
								vm.getList();
					          }
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					vm.driverUnLoad = false;
				});
			},
			//驾驶员绑定接口
			bindDriverSubmit() {
				let vm = this;
                if (vm.bindDriverData.driverId){
                	vm.driverLoad = true;
					vm.bindDriverData.status = "Y";
					let param = vm.bindDriverData;
                    vm.$instance.get("/proxy/bizmgr/car/bindUnbindDriver",{params: param} ).then(res =>{
                    	vm.driverLoad = false;
						if(res.status == 200){
							if (res.data.success) {
								vm.driverFormVisible = false;
								Message({
						          showClose: true,
						          message: '绑定成功',
						          type: 'success',
						          duration: 1000 ,
						          onClose: function(){
						          	vm.getList();
						          }
						        });
							} else {
								Message.error({message:res.data.errorMsg});
							}
						}else{
							Message.error({message:"调用接口失败"});
						}
					}).catch(error => {
						vm.driverLoad = false;
					});
				}else{
					Message.info({message: '请选择驾驶员'}); 
				}
			},
            //设备绑定接口
			bindEquImeiSubmit() {
				let vm = this;
                if (this.bindEquImeiForm.equId){
                	vm.imeiLoad = true;
					this.bindEquImeiForm.status = "Y";
					let param = this.bindEquImeiForm;
                    this.$instance.post("/proxy/bizmgr/car/bindUnbindEqu", param).then(res =>{
                    	vm.imeiLoad = false;
						if(res.status == 200){
							if (res.data.success) {							
								vm.equImeiFormVisible = false;
								Message({
						          showClose: true,
						          message: '绑定成功',
						          type: 'success',
						          duration: 1000 ,
						          onClose: function(){
						          	vm.getList();
						          }
						        });
							} else {
								Message.error({message:res.data.errorMsg});
							}
						}else{
							Message.error({message:"调用接口失败"});
						}
					}).catch(error => {
						vm.imeiLoad = false;
					});
				}else{
					Message.info({message: '请选择设备'}); 
				}
			},
			resetForm(formName) {
        		if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			},
      		//导入
      		//打开导入文件的弹框
			importForm(){
				this.importVisible.imports = true;
			},
			//关闭导入文件弹框
			changeImports(param){
				this.importVisible.imports = param;
				this.getList(true);
			},  
      		
      		//导出
      		exportFormLists() {
				utils.exportLists(this.listQuery, "/proxy/bizmgr/car/export");
      		},  
		}
		
	}
	
</script>
<style rel="stylesheet/scss" scope lang="scss">
	.driver-table tbody tr:nth-child(odd){
		background: #fff;
	}
	.device-imei>div>div {
		cursor: pointer;
		width: 160px;
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		color: #c0c4cc;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
	}
	
	.box .el-dialog {
		width: 25%;
	}
	
	.el-tabs__nav-wrap::after{
		background: none;
	}
	
	.el-tabs__item{
		border: 1px solid #e9e9e9;
		text-align: center;
		border-radius: 4px;
		-webkit-border-radius: 4px;
    	-moz-border-radius: 4px;
    	padding: 0 30px !important;
	}
	.el-tabs__item.is-active{
		background: #1e4d78;
		border: 1px solid #1e4d78;
		color: #fff;
	}
	.el-tabs__active-bar{
		background: none;
	}
	.box form{
		padding-left: 50px;
	}
	.dialogDeptTree {
		border: 1px solid #ddd;
		max-height: 150px;
		overflow-y: auto; 
	}
	.text-btn{
		cursor: pointer;
		color: #67d3e0;
	}
	.equimei-dialog{
		.el-form-item__content{
			width: 227px!important;
			.el-select, .el-input{
				width: 100%;
			}
		}
		.equimei-text{
			color: #969696;
			font-size: 12px;
			text-align: center;
		}		
	}
	.confirm{
		& span, & i{
			display: inline-block;
			vertical-align: middle;
		}
		& .confirm-top{
			text-align: center;
			font-size: 20px;
		    & span, & i{
				display: inline-block;
				vertical-align: middle;
			}
			& .confirm-text{				
                font-weight: 700;				
			}
		
		}
		& .confirm-bottom{
			margin-top: 20px;
			text-align: center;
			& span{
				width: 35%;
			}
		}	

	}
</style>
