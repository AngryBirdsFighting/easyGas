/**
 * @Author:      qinbb
 * @DateTime:    2018-04-16 15:50:37
 * @Description: 一些业务的公共数据（报警类型、组织机构树等）
 */
import { Message } from 'element-ui';
import { utils } from 'src/utils';
import instance from 'src/global/http';

const carTable = {
  state: {
    departData: [],
    departTree: [],
    departTreeData: null,
    alarmData: null
  },
  mutations: {
    //获取组织机构 下拉框
    SET_DEPARTDATA: (state, departData) => {
      state.departData = departData;
    },
    //获取组织机构  树
    SET_DEPARTTREEDATA: (state, departTreeData) => {
      state.departTreeData = departTreeData;
    },
    //获取组织机构  树
    SET_DEPARTTREE: (state, departTree) => {
      state.departTree = departTree;
    },
    //报警数据
    SET_ALARMData: (state, alarmData) => {
      state.alarmData = alarmData;
    }
  },
  actions: {
    //获取组织机构树
    GetDepartData({ commit }, data) {
      return new Promise((resolve, reject) => {
        instance.get("/proxy/sysmgr/depart/departTree").then(res =>{
            if(res.status == 200){
              commit('SET_DEPARTDATA', res.data);
              resolve();
            }else{
              Message.error({message:"调用接口失败"});
              reject();
            }
        }).catch(error => {});
      })
    },
    //获取组织机构树
    GetDepartTree({ commit }, data) {
      return new Promise((resolve, reject) => {
        instance.get("/proxy/lbs/trail/findCarsByTree").then(res =>{
            if(res.status == 200){
              commit('SET_DEPARTTREE', res.data);
              commit('SET_DEPARTTREEDATA', new Date().getTime());
              // console.log("reload");
              resolve();
            }else{
              Message.error({message:"调用接口失败"});
              reject();
            }
        }).catch(error => {});
      })
    },
    GetAlarmData({ commit }) {
      return new Promise(resolve => {
        //获取报警key-vlue数组，保存等待后面使用
        utils.dictsByCode("alarm_type", (res) => {
          var data = {};
          // 将数据转成key-value键值对，方便后边使用
          res.forEach(element => {
            data[element.dictCode] = element.dictName;
          });
          // debugger;
          commit('SET_ALARMData', data); 
          resolve();
        }); 
      });
    },
  }
};
export default carTable;