// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueResize from 'vue-resize'
import VueHighlightJS from 'vue-highlightjs'
import 'babel-polyfill'
import store from './store'
import { sync } from 'vuex-router-sync'

Vue.use(Vuetify)
Vue.use(VueAxios, axios)
Vue.use(VueResize)
Vue.use(VueHighlightJS)

sync(store, router)

require('font-awesome-webpack')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
