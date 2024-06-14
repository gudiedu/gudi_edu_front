import { createStore } from 'vuex'

export default createStore({
  state: {
    counter: 1,
    loginInfo:null,
    studentInfo: null,
  },
  getters: {
    getCounter(state) {
      return state.counter
    },
    getStudentInfo(state) {
      return state.studentInfo
    },
  },
  mutations: {
    increment(state) {
      state.counter++
    },
    setLoginInfo(state, payload) {
      state.loginInfo = payload
    },
    setLogout(state) {
      state.loginInfo=null;
    },
    setStudentInfo(state, payload) {
      state.studentInfo = payload;
    },
  },
  actions: {
    updateStudentInfo({ commit }, data){
      commit('setStudentInfo', data);
    },
  },
  modules: {
  }
})
