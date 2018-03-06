// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-teal.css'
import axios from 'axios'
import {Upload, Tooltip, Pagination, Input, Dialog} from 'element-ui'
Vue.use(MuseUI)
Vue.use(Upload)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Dialog)
Vue.config.productionTip = false
window.axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
