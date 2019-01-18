/**
 * @Author:      qinbb
 * @DateTime:    2018-02-01 11:07:54
 * @Description: 中间的主体  vue2的transition过渡组件 transition属性mode="out-in" 实现了淡入淡出的效果
 *  router-view  渲染路径匹配到的视图组件 渲染的组件还可以内嵌自己的 router-view，根据嵌套路径，渲染嵌套组件。
 */
 <template>
      <transition name="fade" mode="out-in">
          <router-view :key="key"></router-view>
      </transition>
</template>

<script>
  export default {
    name: 'AppMain',
    components: {},
    mounted() {},
    computed: {
      key() {
        let routerName = (this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date());
        return routerName;
      }
    }
  }
</script>

