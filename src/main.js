import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import 'lib-flexible'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/common.scss'
// import axios from 'axios'

// axios.defaults.baseURL = 'http://192.168.48.131:10002'
// axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.config.productionTip = false
// this.$cookies.set('yingzi', 123, 24)

//全局注册过滤器, 一般用于格式化数据
Vue.filter('formatDate', (value, format) => {
  //value: 需要格式化的数据
  //format: 指定格式 yyyy-MM-dd hh:mm:ss

  // 

  let date = new Date(value);

  //获取年份
  let year = date.getFullYear();
  // 
  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    let content = RegExp.$1;
    // 
    format = format.replace(content, year.toString().slice(4 - content.length));

    // 
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in o) {
    //构造动态正则
    let reg = new RegExp(`(${key}+)`);
    // 
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // 
      let k =  o[key] >= 10 ? o[key] : content.length == 2 ? '0' + o[key] : o[key];
      // 
      format = format.replace(content, k);
      // 
    }
  }

  return format;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')