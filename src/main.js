import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import 'lib-flexible'
import 'font-awesome/css/font-awesome.min.css'
// import axios from 'axios'

// axios.defaults.baseURL = 'http://192.168.48.131:10002'
// axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.config.productionTip = false
// this.$cookies.set('yingzi', 123, 24)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')