/**
 * @Author:      qinbb
 * @DateTime:    2018-01-31 18:43:44
 * @Description: app的store状态管理：navbar中的点击小图标 菜单可以伸缩的
 * 注意：JavaScript代码是运行在内存中的，代码运行时的所有变量，函数，也都是保存在内存中的。刷新页面，以前申请的内存被释放，重新加载脚本代码，
 * 变量重新赋值，所以这些数据要想储存就必须储存在外部，例如：Local Storage, Session Storage, IndexDB等。
 * so：vuex中的数据刷新页面后，会全部消失。存vuex时，同时记得存 Session Storage。或者F5时重新获取接口
 */
import Cookies from 'js-cookie';  

const app = {
  //state状态 类似于vue中的data
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
  },
  //Vuex 中的 mutation 类似于事件  第一个参数是state
  mutations: {
    //点击小图标  可以将菜单缩进展开 用常量替代 mutation 事件类型 TOGGLE_SIDEBAR
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    }
  },
  //通过action commit 找到相对应的mutations  来改变state
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR');
    }
  }
};

export default app;
