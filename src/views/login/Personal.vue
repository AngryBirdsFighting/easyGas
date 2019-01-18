/** * @Author: qinbb 
 * *  @DateTime: 2018-03-21 15:30:52 
 * 	  @Description: 个人信息组件 
 */
<template>
	<div class="app-container personal-view" :style="{  height: tableHeight + 'px' }">
		<el-row :gutter="24">
			<el-col :span="24">
				<div class="user_info">
					<h2>个人信息</h2>
					<div class="user_info_text">
						<el-form label-position="right" label-width="100px">
							<el-form-item label="账号：">
								{{ userInfo.account }}
							</el-form-item>
							<el-form-item label="APP登录：">
								<span v-if="userInfo.allowMobile">允许</span>
								<span v-else>不允许</span>
							</el-form-item>
							<el-form-item label="联系人：">
								{{ userInfo.contacts }}
							</el-form-item>
							<el-form-item label="邮箱：">
								{{ userInfo.email }}
							</el-form-item>
							<el-form-item label="帐号昵称：">
								<span v-if="userInfo.nick">{{ userInfo.nick }}</span>
								<span v-else>暂未定义</span>
							</el-form-item>
							<el-form-item label="手机号：">
								{{ userInfo.phone }}
							</el-form-item>
							<el-form-item label="用户：">
								<span v-if="userInfo.superadmin">超级管理员</span>
								<span v-else>普通用户</span>
							</el-form-item>
							<el-form-item label="账号状态：">
								<span v-if="userInfo.valid">可用</span>
								<span v-else>不可用</span>
							</el-form-item>
							<el-form-item label="角色列表：">
								<span v-if="userInfo.roles.length > 0">{{ userInfo.roles }}</span>
								<span v-else>暂未赋权</span>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import "../../assets/css/index.scss";

	var echarts = require('echarts');

	export default {
		data() {
			return {
				heightData: 540

			}
		},
		computed: {
			...mapGetters([
				// 映射 userInfo
				'userInfo'
			]),
			// 计算属性的 getter
			tableHeight: function() {
				// `this` 指向 vm 实例
				let height = document.documentElement.offsetHeight || document.body.offsetHeight;
				this.heightData = height;
				return this.heightData;
			}
		},
		mounted() {
			let routers = this.$store.getters.permission_routers;//获取当前用户的菜单
			if (routers.length == 0) {
				$('.personal-view').css('margin-left', '10px');
			} else{
				$('.personal-view').css('margin-left', '220px');
			}
		},
		methods: {
			
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.user_info {
		border: 1px solid #dee1e2;
		h2 {
			margin: 0;
			font-weight: normal;
			padding: 10px 20px;
			border-bottom: 1px solid #dee1e2;
			.i_edit {
				float: right;
				font-size: 16px;
				color: #7ab8ed;
			}
		}
	}
	
	.user_info_form,
	.user_info_text {
		padding: 20px;
	}
	
	.el-form-item {
		margin-bottom: 0;
	}
</style>