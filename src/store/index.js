import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  // state: {
  // },
  // mutations: {
  // },
  // actions: {
  // },
  modules: {
  }
})
