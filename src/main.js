import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// import api from './request/api'
import apiAll from './request/apiAll'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 引入全局请求配置
console.log(apiAll)
Vue.prototype.$http = apiAll
console.log(Vue.prototype)
// Vue.prototype.$api = api
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
