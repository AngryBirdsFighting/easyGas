/**
 * @Author:      qinbb
 * @DateTime:    2018-02-01 11:07:45
 * @Description:  将左侧菜单组件放到html中  mapGetters创建路由映射
 */
 <template>
 <div>
     <div class="logo" style="border-bottom:1px solid #909399">
         <img src="../../assets/img/logo.png" style="width:45px;margin-right:20px"/>
         气表平台
     </div>
     <el-menu v-if="permission_routers.length != 0" mode="vertical" class="el-menu-vertical-demo" background-color="#253e55" text-color="#7d7d7d" active-text-color="red"  >
        <sidebar-item :routes='permission_routers' :perms='permission_perms'></sidebar-item>
    </el-menu>
 </div>
    
</template>

<script>
    import { mapGetters } from 'vuex';
    import SidebarItem from './SidebarItem';//左侧菜单
    export default {
      components: { SidebarItem },//左侧菜单组件
      computed: {
        // mapGetters工具函数 使用对象展开运算符（...）  会将store中的getter映射到局部计算属性中
        //如果你要将getter映射为不同的名称，请使用一个对象：{routers：permission_routers} 默认名称一样的是[]
        ...mapGetters([
          // 映射 this.permission_routers 为 store.getters.permission.routers
          'permission_routers','permission_perms'
        ])
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    // .el-menu {
    //     min-height: 100%;
    // }
    .logo{
        width:100%;
        height:60px;
        background: #253e55;
        color: #fff;
        line-height: 60px;
        text-align: center;
    }
</style>
