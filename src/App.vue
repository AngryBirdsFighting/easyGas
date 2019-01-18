/**
 * @Author:      qinbb
 * @DateTime:    2018-01-31 16:38:50
 * @Description: app组件加载路由router-view
 */
<template>
    <div class="apps">
        <router-view></router-view>
    </div>
</template>

<script>
	import { utils } from 'src/utils';
    export default{
      name: 'APP',
      mounted() {
        utils.setContentHeight();//自动计算高度
      },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

