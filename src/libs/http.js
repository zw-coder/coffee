import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
axios.defaults.withCredentials = true
import qs from 'qs'
import {
  appkey
} from '@/datas/key'

function axiosGet(options) {
  axios.get(options.url + "&appkey=" + appkey)
    .then((res) => {
      options.success(res.data)
    })
    .catch((err) => {
      options.error(err)
    });
}

function axiosPost(options) {
  axios.post(
      options.url,
      qs.stringify(options.data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }
    )
    .then((res) => {
      options.success(res.data)
    })
    .catch((err) => {
      options.error(err)
    })
}

export {
  axiosGet,
  axiosPost
}


// const a;
// a.axiosGet;

// module.exports=a