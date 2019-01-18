/** * 
 * @Author: qinbb 
 * @DateTime: 2018-02-01 11:07:49 
 * @Description: 左侧菜单 
 */
<template>
	<div>
		<!-- 注意：路由表不能配置在后端，不然前端无法配置跳转到某些路由，例如提交成功后返回至某个固定路由 -->
		<el-menu :default-active="activeMenu" mode="vertical" :default-openeds="defaultOpeneds" 
			:unique-opened="true" class="el-menu-vertical-demo" background-color="#253e55" text-color="#fff" active-text-color="#67d3e0"
			v-loading="menuLoad"
			element-loading-text="拼命加载中">
			<!-- v-for 是从当前就开始循环 若是在el-menu中的话  就表明会有多个菜单  -->
			<div v-for="item in routes" :key="item.menuId" class="meun">
				<!--一级菜单-->
				<router-link v-if="item.children && item.children.length < 1" :to="item.frontRouting">
					<el-menu-item :index="item.frontRouting">
						<span :class="item.menuIcon" aria-hidden="true"></span>{{item.menuName}}
					</el-menu-item>
				</router-link> 
				<!--二级菜单-->
				<el-submenu v-else-if="item.children && item.children.length > 0" :index="item.frontRouting">
					<template slot="title">
						<span :class="item.menuIcon" aria-hidden="true"></span> {{item.menuName}}
					</template>
					<router-link v-for="child in item.children" :key="child.menuId" class="menu-indent" :to="child.frontRouting">
						<el-menu-item :index="child.frontRouting">{{child.menuName}}</el-menu-item>
					</router-link>
				</el-submenu>
				<!--一级菜单-->
				<router-link v-else :to="item.frontRouting">
					<el-menu-item :index="item.frontRouting">
						<span :class="item.menuIcon" aria-hidden="true"></span>{{item.menuName}}
					</el-menu-item>
				</router-link>
			</div>
		</el-menu>
		<!-- <div class="show_hide_menu">
			<div :class=" isActive ? 'menu_hide' : 'menu_show'" @click="toggleSideBar"></div>
		</div> -->
	</div>
</template>

<script>
	//获取vuex中的菜单权限 进行菜单show展示。登陆成功时直接 返回菜单json 并包含帐户信息
	export default {
		name: 'SidebarItem',
		props: {
			routes: {},
			perms: {}
		},
		data() {
			return {
				activeMenu: "", //选中的菜单颜色改变
				defaultOpeneds: [], //打开的菜单 是el-submenu的index值
				url: "",
				menuLoad: true,//菜单加载
			}
		},
		mounted() {
			this.activeMenus();
			this.menuLoads();
		},
		computed: {
			isActive(){
				if(this.$store.getters.sidebar.opened){//判断左侧菜单是否为打开状态，返回true,false
					return false;				
				} else {
					return true;	
				}
			}
		},
		//监听路由变化：包括浏览器前进后退
		watch: {
			$route(now, old) { //监控路由变换，控制返回按钮的显示
				this.activeMenus();
			}
		},
		methods: {
			menuLoads(){
				if(this.routes){
					this.menuLoad = false;
				}
			},
			activeMenus() {
				this.defaultOpeneds = [];//清空打开菜单index数组 每次只打开一个菜单
				let purl = window.location.href;
				purl = purl.substr(purl.indexOf("#") + 1); //hash
				this.activeMenu = purl;
				this.url = purl;
				this.defaultOpeneds.push(purl.split("/")[1]);
				this.defaultOpeneds = [...new Set(this.defaultOpeneds)]; //打开菜单index数组进行去重  ，可以打开多个菜单。
			},
			
			//菜单收缩
			toggleSideBar() {
				$(this).toggleClass('is-active');
	            this.$store.dispatch('ToggleSideBar');
	        },
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.wscn-icon {
		margin-right: 10px;
	}
	
	.el-submenu,
	.el-menu-item {
		min-width: 200px;
	}
	
	.el-submenu .el-menu-item {
		padding: 0 0 0 60px !important;
	}
	
	.meun span {
		display: inline-block;
		width: 23px;
		height: 23px;
		background-repeat: no-repeat;
		background-position: center center;
	}
	
	.menu1-iocn {
		background-image: url(../../assets/img/menu1-iocn.png);
	}
	
	.menu2-iocn {
		background-image: url(../../assets/img/menu2-iocn.png);
	}
	
	.menu3-iocn {
		background-image: url(../../assets/img/menu3-iocn.png);
	}
	
	.menu4-iocn {
		background-image: url(../../assets/img/menu4-iocn.png);
	}
	
	.menu5-iocn {
		background-image: url(../../assets/img/menu5-iocn.png);
	}
	
	.show_hide_menu {
		height: 100%;
		width: 10px;
		background-color: rgba(255,255,255,0);
		position: absolute;
		top: 0;
		right: 0;
		z-index: 10;
		div{
			position: relative;
			width: 10px;
			height: 60px;
			top: 47%;
			cursor: pointer;
		}
		.menu_show{
			background: url(../../assets/img/menu-hide.png) no-repeat center center;
		}
		.menu_hide{
			background: url(../../assets/img/menu-show.png) no-repeat center center;
		}
	}
</style>