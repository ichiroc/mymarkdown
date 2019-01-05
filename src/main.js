import 'shitajicss/docs/css/shitaji.min.css'
import './scss/style.scss'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
