/** 
 * @Author: qinbb 
 * @DateTime: 2018-02-01 18:43:03 
 * @Description: 登录页面组件 
 */
<template>
	<div class="login-container">
		<header>
			<ul>
				<li class="fl">
					<!-- <img src="../../assets/img/logo.png"/> -->
					<span>业务平台</span>
				</li>
				<!-- <li class="fr" v-if="androidUrl || iosUrl">
					<span>APP下载:</span>
					<div class="fl" v-if="androidUrl">
						<img :src="android ? androidIconShow : androidIconHide" class="ewm-icon android-icon" @mouseover="ewmShowHide('over', 'android')" @mouseout="ewmShowHide('hide', 'android')"/>
						<img :src="androidUrl" :class="android ? 'ewm ewmShow' : 'ewm ewmHide'"/>
					</div>
					<div class="fl" v-if="iosUrl">
						<img :src="ios ? iosIconShow : iosIconHide" class="ewm-icon" @mouseover="ewmShowHide('over', 'IOS')" @mouseout="ewmShowHide('hide', 'IOS')"/>
						<img :src="iosUrl" :class="ios ? 'ewm ewmShow' : 'ewm ewmHide'"/>
					</div>
					<span class="clear"></span>
				</li> -->
			</ul>
		</header>
		
		<el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">			
			<div class="login-box">
				<p>登录</p>
				<!-- <el-form-item prop="entCode">
					<el-input prefix-icon="icon-c-qiyexinxi" name="entCode" v-model="loginForm.entCode" type="text"  autoComplete="off" placeholder="企业标识" style="width:100%;" clearable></el-input>
				</el-form-item> -->
				<el-form-item prop="account">
					<el-input  prefix-icon="icon-c-yonghu" name="account" v-model="loginForm.account" type="text"   autoComplete="off" placeholder="账号：admin" style="width: 100%;" clearable></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input  prefix-icon="icon-c-mima" name="password" v-model="loginForm.password" type="password"   autoComplete="off" placeholder="密码：admin123456" style="width: 100%;" clearable></el-input>
				</el-form-item>
				<el-form-item prop="identifyCode">
				    <el-input  prefix-icon="icon-c-anquan" name="identifyCode" v-model="loginForm.identifyCode" @keyup.enter.native.prevent="handleLogin" style="width:145px;" placeholder="验证码" clearable></el-input>
				    <img class="yz-img" :src= "loginForm.imgSrc" @click="changeCode" />
				    <el-button class="code-btn" size="mini" @click.native.prevent="changeCode" round>换一组</el-button>
				</el-form-item>
				<el-form-item class="sub-btn">
					<el-button type="primary" @click.native.prevent="handleLogin" :loading="logining">{{logining ? "登录中..." : "登 录"}}</el-button>
				</el-form-item>
				<el-checkbox v-model="loginForm.checked">记住密码</el-checkbox>
				<el-button type="primary" class="forget-pass" @click.native.prevent="sendPassFormVisible = true">忘记密码</el-button>
			</div>
		</el-form>
		
		<!--忘记密码弹框-->
		<el-dialog title="忘记密码" :visible.sync="sendPassFormVisible" top="8%" width="60%" height="570px" lock-scroll class="boxres dialog_input" @close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
			<div class="send_box">
				<el-steps :active="active" finish-status="success" align-center>
				  	<el-step title="填写账号"></el-step>
				  	<el-step title="验证身份"></el-step>
				  	<el-step title="重置密码"></el-step>
				  	<el-step title="完成"></el-step>
				</el-steps>
				<el-form :inline="true" :model="ruleForm1" :rules="restRules" ref="ruleForm1" class="send_form" label-position="left" 
					label-width="100px">
					<div v-show="step1" class="send_con steps1">
						<el-form-item prop="entCode" label="企业标识">
							<el-input name="entCode" placeholder="请输入企业标识" v-model="ruleForm1.entCode"></el-input>
						</el-form-item>
						<el-form-item prop="account" label="账号" style="display:block">
							<el-input name="account" placeholder="请输入账号" v-model="ruleForm1.account"></el-input>
						</el-form-item>
						<el-form-item label="验证方式" prop="validateType" style="margin-left:-60px" @change.native.prevent="changeContact">
						    <el-radio-group v-model="ruleForm1.validateType">
						      <el-radio :label="'sms'">手机</el-radio>
						      <el-radio :label="'email'">邮箱</el-radio>
						    </el-radio-group>
					    </el-form-item>
					</div>
				</el-form>
				<el-form :inline="true" :model="ruleForm2" :rules="restRules" ref="ruleForm2" class="send_form">
					<div v-show="step2" class="send_con steps2 ">
						<el-form-item prop="smsCode" label="验证码">
							<el-input name="smsCode" placeholder="请输入验证码" v-model="ruleForm2.smsCode"></el-input>
						</el-form-item>
							<el-button @click.native.prevent="getCodes" :disabled="codeDisabled">{{clickCodeText}}</el-button>
							<p>
								请注意在{{titles}}<span>{{contact}}</span>查收验证码，如{{titles}}已更换或丢失，请联系管理员
							</p> 
					</div>
				</el-form>
				<el-form :inline="true" :model="ruleForm3" :rules="restRules" ref="ruleForm3" class="send_form">
					<div v-show="step3" class="send_con steps3 ">
						<el-form-item label="密码" prop="pass">
						    <el-input name="pass" type="password" v-model="ruleForm3.pass" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label="确认密码" prop="checkPass" style="margin-top:13px">
						    <el-input name="checkPass" type="password" v-model="ruleForm3.checkPass" auto-complete="off"></el-input>
						</el-form-item>
						<p>6-20位字母、数字、符，区分大小写</p>
					</div>
				</el-form>
				<div v-show="step4" class="send_con steps4 ">
					<i class="el-icon-success"></i>
					<p>完成</p>
				</div>
				<div align="center">
					<el-button v-show="cancels" @click.native.prevent="cancel">取消</el-button>
					<el-button v-show="lastBtn" class="filter-item btnColor" type="primary" @click.native.prevent="stepsFn('last')">上一步</el-button>
					<el-button v-show="nextBtn" class="filter-item btnColor" type="primary" @click.native.prevent="stepsFn('next')">下一步</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { validate } from 'utils/validate';
	import Cookies from 'js-cookie';
    import { Message } from 'element-ui';
    import Base64 from '../../../static/base64';
    import md5 from 'blueimp-md5';
    import { utils } from 'src/utils';

	export default {
		name: 'login',
        data() {
        	const validatePass = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请输入密码'));
		        } else {
		          	if (this.ruleForm3.checkPass !== '') {
		            	this.$refs.ruleForm3.validateField('checkPass');//validateField对部分表单字段进行校验的方法
		          	}
		          	callback();
		        }
		    };
	      	const validatePass2 = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('请再次输入密码'));
		        } else if (value !== this.ruleForm3.pass) {
		          	callback(new Error('两次输入密码不一致'));
		        } else {
		          	callback();
		        }
		    };
			return {
				loginForm: {
					entCode:'aa',
					account: '',
					password: '',
					identifyCode: '',
					imgSrc: "#",//动态获取验证码
					checked: true
				},
				logining: false,
				loginRules: {
					entCode: [
						{ required: true, message: '请输入企业', trigger: 'blur'},
	                ],
					account: [
						{ required: true, message: '请输入账号', trigger: 'blur'},
	                ],
	                password: [
	                    { required: true, trigger: 'blur', validator: validate.validatePass },
	                ],
					identifyCode: [
			            { required: true, message: '请输入验证码', trigger: 'blur' },
			        ]
				},
				showDialog: false,
				android: false,
				ios: false,
				androidIconShow: require('../../assets/img/android-active.png'),
				androidIconHide: require('../../assets/img/android.png'),
				iosIconShow: require('../../assets/img/IOS-active.png'),
				iosIconHide: require('../../assets/img/IOS.png'),
				androidUrl: '',
				iosUrl: '',
				sendPassFormVisible: false,
				
				
				active: 0,//设置当前激活步骤
				step1:true,//步骤一
				step2:false,//步骤二
				step3:false,//步骤三
				step4:false,//步骤四
				cancels:true,//取消按钮
				lastBtn: false,//上一步
				nextBtn:true,//下一步
				contact: '',//联系方式
				titles: '手机',//联系方式
				clickCodeText: "点击获取",//获取验证码按钮文字
				codeDisabled: false,//获取验证按钮状态
				forms: {
					entCode: '',//企业标识
					account: '',//账号
					validateType: '',//验证方式 默认是邮箱
					status: 'N'//是否发送验证码
		        },
		        ruleForm1: {
					entCode: '',//企业标识
					account: '',//账号
					validateType: 'sms',//验证方式 默认是手机
					status: 'N'//是否发送验证码
		        },
		        ruleForm2: {
					smsCode: '',//验证码
		        },
		        ruleForm3: {
		          	pass: '',//密码
		          	checkPass: ''//再次密码
		        },
		        restRules: {
		        	entCode: [
			            { required: true, message: '请输入企业标识', trigger: 'blur'},
			        ],
			        account: [
			            { required: true, message: '请输入账号', trigger: 'blur'},
			        ],
			        validateType: [
			            { required: true, message: '请选择验证方式', trigger: 'blur'},
			        ],
			        smsCode: [
			            { required: true, message: '请输入验证码', trigger: 'blur'},
			        ],
			        pass: [
				        { required: true, message: '请输入密码', trigger: 'blur'},
				        { required: true, trigger: 'blur' , validator: validate.validatePass},
			            { validator: validatePass, trigger: 'blur' }
			        ],
			        checkPass: [
				        { required: true, message: '请再次输入密码', trigger: 'blur'},
				        { required: true, trigger: 'blur' , validator: validate.validatePass},
			            { validator: validatePass2, trigger: 'blur' }
			        ]
		        },
		        codeInterval: null,//验证码定时器
		        waitTime: 60,
			}
		},
		//计算属性
		computed: {
		    
		},
        //3.在beforeMount和mounted之间，程序将上一步编辑好的html内容替换el属性指向的dom对象或者选择权对应的html标签里面的内容
        beforeMount: function() {
        	if(Cookies.get('userName') && Cookies.get('entCode')){
        		this.loginForm.entCode = Cookies.get('entCode');
				this.loginForm.account = Cookies.get('userName');

				if (Cookies.get('password')) {
					let base = new Base64(); 
					this.loginForm.password = base.decode(Cookies.get('password'));
				}
        	}
        },
        mounted() {
			// this.getQRcode();
		},
		//方法
		methods: {
			//登录
			handleLogin() {
				let vm = this;
				//调用方法isValidate  form表单校验  第一个参数this  第二个参数是from表单ref的值  第三个参数是form表单提交参数
				validate.isValidate(vm,"loginForm",(formData)=>{
					if(formData.validates){
						formData.param.flags = true;
						vm.logining = true;
						debugger
						if(formData.param.account != "admin" || formData.param.password != "admin123456"){
							Message.error("账号或密码错误");
							vm.loginForm.identifyCode = "";
							vm.logining = false;
							retutn
						}
			            vm.$store.dispatch('Login', formData.param).then((res) => {
			            	vm.$store.dispatch('GetInfo').then(res => { // 拉取user_info
								vm.$router.push({ path: '/' });  
								vm.logining = false;   
					        }).catch(err => {
								console.log(err);
								vm.logining = false;
							});
		              	}).catch(err => {
							Message.error(err);
							vm.changeCode();
							vm.loginForm.identifyCode = "";
							vm.logining = false;
						});
					}
				}, this.loginForm);				
	        },
	        //动态获取验证码
	        changeCode(){
	        	let date = new Date();
	        	this.loginForm.imgSrc = '/proxy/identifyCode?a=' + date.getTime();
	        },
	        //获取APP二维码
	        getQRcode() {
	        	var vm = this;
	        	vm.$instance.get("/proxy/showApk", {}).then(res =>{
					vm.changeCode();
					if(res.status == 200){
						vm.androidUrl = res.data.androidUrl;
						vm.iosUrl = res.data.iosUrl;
					}
				}).catch(error => {
					vm.changeCode();
				});
	        },
	        //APP二维码的显示隐藏
	        ewmShowHide(type, appType) {
	        	if (type == 'over') {
	        		if (appType == 'android') {
	        			this.android = !this.android;
	        		} else {
	        			this.ios = !this.ios;
	        		}
	        	} else{
	        		if (appType == 'android') {
	        			this.android = !this.android;
	        		} else{
	        			this.ios = !this.ios;
	        		}
	        	}
	        },
	        
	    /*忘记密码*/
	        //上一步下一步
		    stepsFn(param){
		    	const vm = this;
		    	//下一步
		    	if(param === "next"){
					if (vm.active === 0) {
						vm.ruleForm2.smsCode = '';
						vm.resetForm("ruleForm2");
						vm.steps1Fn();
			        } else if (vm.active === 1) {
			        	vm.resetForm("ruleForm3");
			        	vm.ruleForm3.pass = '';
		    			vm.ruleForm3.checkPass = '';
			        	vm.steps2Fn();
			        } else if (vm.active === 2) {
			        	vm.steps3Fn();
			        } else if (this.active === 3) {
			          	vm.active = 3;
			        }
			    //上一步
		    	}else if(param === "last"){
		    		if (vm.active === 1) {
			          	vm.active--;
			          	vm.lastBtn = false;
			          	vm.step1 = true;
			          	vm.step2 = false;
			          	vm.ruleForm1.status = 'N';
			        } else if (vm.active === 2) {
			          	vm.active--;
			          	vm.step2 = true;
			          	vm.step3 = false;
			          	vm.ruleForm2.smsCode = '';
			        } else if (this.active === 3) {
			          	vm.active = 3;
			          	vm.ruleForm3.pass = '';
		    			vm.ruleForm3.checkPass = '';
			        }
		    	}
		    },
		    changeContact(){
				if(this.ruleForm1.validateType == "email"){
					this.titles = "邮箱";
				}else if(this.ruleForm1.validateType == "sms"){
					this.titles = "手机";
				}
		    },
		    //第一步
		    steps1Fn(){
		    	const vm = this;
				validate.isValidate(vm, "ruleForm1",(formData)=>{
					if(formData.validates){
						//有验证码 只是单纯点击上一步下一步  就不会发送验证码
						if(vm.ruleForm2.smsCode && vm.forms.entCode == vm.ruleForm1.entCode 
							&& vm.forms.account == vm.ruleForm1.account 
							&& vm.forms.validateType == vm.ruleForm1.validateType){
							vm.active++;
				          	vm.lastBtn = true;
				          	vm.step1 = false;
				          	vm.step2 = true;
						}else{
							vm.getValidAccount(formData);
						}
					}
				},vm.ruleForm1);
		    },
		    getValidAccount(formData){
		    	const vm = this;
		    	return new Promise((resolve, reject) => {
	               //调用接口
			       vm.$instance.post('/proxy/sysmgr/account/validateAccount', formData.param).then(res =>{
			          if(res.status == 200 && res.data.success){
				          	vm.forms = JSON.parse(JSON.stringify(vm.ruleForm1));
			                
			                vm.active++;
				          	vm.lastBtn = true;
				          	vm.step1 = false;
				          	vm.step2 = true;
			                resolve();//异步操作成功
			            }else{
			                Message.error(res.data.errorMsg);
			            }
			        }).catch(error => {});
	            });
		    },
		    //第二步
		    steps2Fn(){
		    	const vm = this;
		    	let param = {};
		    	param.code = vm.ruleForm2.smsCode;//验证码
		    	param.validateType = vm.ruleForm1.validateType;//校验方式
		    	validate.isValidate(vm, "ruleForm2",(formData)=>{
					if(formData.validates){
						vm.getvalidateCode(formData);
					}
				},param);
		    },
		    getvalidateCode(formData){
		    	const vm = this;
		    	return new Promise((resolve, reject) => {
	               //验证码校验
			       vm.$instance.post('/proxy/sysmgr/account/validateCode', formData.param).then(res =>{
			          if(res.status == 200 && res.data.success){
				          	let times = utils.getTodayTime('2');
			                Cookies.set('token', res.data.token); //忘记密码用户帐户 token
			                vm.active++;
				          	vm.lastBtn = true;
				          	vm.step2 = false;
				          	vm.step3 = true;
			                resolve();//异步操作成功
			            }else{
			                Message.error(res.data.errorMsg);
			            }
			        }).catch(error => {});
	            });
		    },
		    //第三步
		    steps3Fn(){
		    	const vm = this;
		    	let param  ={};
		    	param.account = vm.ruleForm1.account;
		    	param.entCode = vm.ruleForm1.entCode;
		    	param.password = vm.ruleForm3.checkPass;
		    	param.token = Cookies.get('token');
		    	validate.isValidate(vm, "ruleForm3",(formData)=>{
					if(formData.validates){
						vm.resetPassword(formData);
					}
				},param);
		    },
		    
		    resetPassword(formData){
		    	const vm = this;
				return new Promise((resolve, reject) => {
	               //调用接口
			       vm.$instance.post('/proxy/sysmgr/account/resetPassword', formData.param).then(res =>{
			          if(res.status == 200 && res.data.success){
				          	vm.active++;
				          	vm.step3 = false;
				          	vm.step4 = true;
				          	vm.cancels = false;
				          	vm.lastBtn = false;
				          	vm.nextBtn = false;
			                resolve();//异步操作成功
			                setTimeout(function() {
								vm.cancel();
								vm.cancels = true;
					          	vm.nextBtn = true;
							}, 1500);
			            }else{
			                Message.error(res.data.errorMsg);
			            }
			        }).catch(error => {});
	            });
		    },
		    
		    //获取邮箱或者手机验证码
		    getCodes(){
		    	const vm = this;
		    	vm.codeDisabled = true;
	    		return new Promise((resolve, reject) => {
	               //调用获取短信验证码接口
	               vm.ruleForm1.status = 'Y';
			       vm.$instance.post('/proxy/sysmgr/account/validateAccount', vm.ruleForm1).then(res =>{
			          if(res.status == 200 && res.data.success){
			          		vm.contact = res.data.contact;//联系方式
			          		vm.ruleForm1.status = 'N';
			          		vm.initCodes()
			                resolve();//异步操作成功
			            }else{
			                Message.error(res.data.errorMsg);
			            }
			        }).catch(error => {});
	            });
		    },
		    
		    //90秒后才可以再次点击 获取验证码
		    initCodes(){
		    	const vm = this;
		    	vm.codeInterval = setInterval(function(){
			        vm.waitTime--;
			        vm.clickCodeText = "重新获取(" + vm.waitTime + "s)";
			        if (vm.waitTime == 0) {
			        	vm.clickCodeText = "点击获取";
			        	vm.waitTime = 60;
			        	vm.codeDisabled = false;
			        	vm.contact = "";
			        	clearInterval(vm.codeInterval);//停止周期
			        }
				}, 1000);
		    },
			//取消返回登录页面
		    cancel() {
		    	this.sendPassFormVisible = false;
		    	this.active = 0;
		    	this.step1 = true;//步骤一
				this.step2 = false;//步骤二
				this.step3 = false;//步骤三
				this.step4 = false;//步骤四
				this.lastBtn = false;
		    	this.ruleForm1.entCode = '';
		    	this.ruleForm1.account = '';
		    	this.ruleForm1.validateType = 'sms';
		    	this.ruleForm1.status = 'N';
		    	this.ruleForm2.smsCode = '';
		    	this.ruleForm3.pass = '';
		    	this.ruleForm3.checkPass = '';
		    	this.resetForm("ruleForm1");
		    	this.resetForm("ruleForm2");
		    	this.resetForm("ruleForm3");
		    	this.changeCode();
	        },
	        
	        resetForm(formName) {
        		if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
      		},
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	@import "src/assets/css/mixin.scss";
	.login-container {
		@include relative;
		height: 100vh;
		background: url('../../assets/img/login.jpg') no-repeat;
		background-size: cover;
		header {
			@include height(100px);
	        background: #67d3e0;
	        ul{
	        	display: inline-block;
	        	width: 100%;
	        	@include height(100px);
	        	padding: 0 10%;
	        	li{
	        		display: inline-block;
	        		@include height(100px);
	        	}
	        }
	        
	        span{
	        	color: #fff;
	        	font-family: "微软雅黑";
	        	display: inline-block;
	        	float: left;
	        	font-weight: 500;
	        	letter-spacing: 3px;
	        }
	        li.fl{
	        	span{
	        		font-size: 30px;
	        		margin-left: 20px;
	        	}
	        	img{
		        	height: 60px;
		        	float: left;
		        	margin-top: 20px;
		        }
	        }
	        li.fr {
	        	span{
	        		font-size: 20px;
	        	}
	        	.ewm-icon{
	        		margin: 25px 20px;
	        		cursor: pointer;
	        	}
	        	div{
	        		position: relative;
	        		height: 100%;
	        		.ewm{
	        			position: absolute;
	        			top: 100px;
	        			left: -20px;
	        			z-index: 10;
	        			width: 130px;
	        			transition: all .3s;
	        		}
	        		.ewmShow{
	        			opacity: 1;
	        		}
	        		.ewmHide{
	        			opacity: 0;
	        		}
	        	}
	        }
	    }
	    .login-form {
			position: absolute;
			right: 18%;
        	top: 25%;
			.login-title {
	            margin-bottom: 15px;
	            text-align: center;
	        }
	        .login-box {
				width: 400px;
				height: 425px;
	            border-radius: 3px;
	            @include boxShadow(0, 0, 5px, 3px, rgba(212, 212, 215, 0.8));
	            background: #fff;
	            padding: 30px 40px;
	            .el-input__inner{
	            	height: 36px !important;
	            }
	            input{
	            	padding-left: 45px;
	            }
	            p {
					width: 100%;
					font-size: 20px;
					text-align: center;
					color: #4f4f4f;
	                margin-bottom: 20px;
	            }
	            .yz-img{
	            	@include height(36px);
	            	width: 92px;
					margin-left: 2px;
	            	@include cursor;
				}
				.code-btn{
				  @include cursor;
				  font-size: 12px;
				  margin-left: 2px;
				  color: #b5b5b5;
				  display:inline-block;
				}
	            .forget-pwd{
	            	float: right;
					font-size: $fontSize14;
					color: #67d3e0;
				}
				.el-checkbox__label{
					color: #67d3e0;
				}
				.el-checkbox__input.is-checked .el-checkbox__inner{
					border-color: #67d3e0;
					background-color: #67d3e0;
				}
	            .sub-btn button{
	                @include cursor;
	                @include borderRadius;
	                @include size(100%, 36px);
	                background: #67d3e0;
	                color: #fff;
	                font-size: $fontSize16;
	                -webkit-transition: all .1s;  //css3 有些浏览器不支持 Chrome || Safari
				    -moz-transition: all .1s;  //css3 有些浏览器不支持 Firefox 
				    -ms-transition: all .1s;//css3 有些浏览器不支持 IE
				    -o-transition: all .1s;//css3 有些浏览器不支持 Opera
	                border: none; 
	                &:hover{
	                    background-color: #39c4d5;
	                }
	                &:active{
	                    background-color: #39c4d5;
	                }
	            }
	            .forget-pass{
	            	float: right;
	            	background: none;
	            	color: #67d3e0;
	            	border: none;
	            }
	        }
		}
		.send_box{
	    	background: #fff;
	    	margin: 0 auto;
	    	@include borderRadius;
	    	padding: 80px 20px;
	    	.el-step__title{
	    		font-size: 14px;
	    		color: #CECECE;
	    	}
	    	.el-step__title.is-process,
	    	.el-step__title.is-success{
	    		color: #66C23B;
	    	}
	    	.el-step__head.is-process{
	    		color: #66C23B;
	    		border-color: #66C23B;
	    	}
	    	.send_form{
	    		text-align: center;
	    		.next{
	    			color: #fff;
	    		}
	    	}
	    	.send_con{
	    		width: 80%;
	    		min-height: 230px;
	    		margin: 20px auto;
	    		padding: 60px 0 0 0;
	    		.el-input,input[type=text]{
	    			width: 240px;
	    		}
	    	}
	    	.steps1{
    			padding-top: 90px;
    		}
    		.steps2>p{
    			margin: 15px auto;
    			line-height: 24px;
    			font-size: 14px;
    			color: #BDBDBD;
    		}
    		.steps3{
    			width: 40%;
    			p{
	    			margin: 5px auto;
	    			font-size: 14px;
	    			color: #BDBDBD;	
	    			padding-left: 80px;
    			}
    		}
    		.steps3>div:nth-child(1){
    			label{
    				margin-left: 30px;
    			}
    		}
    		.steps4{
    			text-align: center;
    			i{
    				font-size: 80px;
    				color: #66C23B;
    			}
    			p{
    				font-size: 30px;
    				color: #66C23B;
    				margin-top: 20px;
    				margin-bottom: 47px;
    			}
    		}
		}
	}
</style>